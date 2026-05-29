# Dárečky pro Dominika — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page gift gallery (`dareckyprodominika.cz`) for family browsing, with price categories, anonymous reservations, three seasonal modes that auto-switch, and dark/light theme — deployed for free on Vercel.

**Architecture:** Next.js 16 App Router with static rendering of the product grid (RSC). Client islands for interactive parts (filter, modal, claim, mode override, theme toggle). Shared reservation state in Upstash Redis exposed via small API routes.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, canvas-confetti, Lucide React, Geist fonts, next-themes, Upstash Redis, Biome, pnpm, Vitest + React Testing Library.

*Note on animations:* The spec mentions Motion (Framer Motion) as an option. For v1 we use CSS transitions + Radix/shadcn built-in animations, which covers every required interaction without a dependency. Motion can be added later if needed.

### Git convention

- Remote: `origin` = `https://github.com/tucnak-dominik/web-darecky.git`
- Default branch: `main`
- **Claude only commits locally. The user pushes from their Mac.** The Claude sandbox is not authenticated to GitHub. Never run `git push`, `git pull`, or any remote-affecting git command. Steps below show `git add` + `git commit` after each task — that is the terminal git step. Mention to the user when a phase is "ready to push" but do not attempt it.

### Safety convention (post-incident)

- **Never delete or `rm` files in the working directory without explicit user confirmation.** The brainstorming-phase artefacts (`CLAUDE.md`, `docs/`) and any pre-existing project files must be preserved.
- If a tool (e.g. `create-next-app`) refuses to operate in a non-empty directory, **stop and ask the user before clearing files**. Never attempt a "backup → wipe → scaffold → restore" workaround on your own.
- Subagents inherit this rule; the controller must restate it explicitly in every subagent prompt that touches the filesystem.

---

## File Structure (target)

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx                       # root layout, fonts, providers, mode class
│   │   ├── page.tsx                         # single-page composition
│   │   ├── globals.css                      # Tailwind + CSS vars (themes + mode accents)
│   │   ├── manifest.ts                      # web app manifest
│   │   ├── opengraph-image.tsx              # OG image (Next.js convention)
│   │   ├── icon.tsx                         # SVG favicon (Next.js convention)
│   │   ├── robots.ts                        # block indexing
│   │   └── api/
│   │       ├── claims/route.ts              # GET all claims
│   │       └── claim/[productId]/route.ts   # POST / DELETE claim
│   ├── components/
│   │   ├── header.tsx                       # sticky header
│   │   ├── footer.tsx
│   │   ├── hero.tsx                         # mode-aware hero
│   │   ├── filter-bar.tsx                   # category + hide-claimed
│   │   ├── product-grid.tsx                 # animated grid layout
│   │   ├── product-card.tsx                 # individual card
│   │   ├── product-modal.tsx                # dialog with details
│   │   ├── claim-button.tsx                 # claim/unclaim toggle
│   │   ├── mode-switcher.tsx                # override dropdown (testing)
│   │   ├── mode-provider.tsx                # mode context
│   │   ├── claims-provider.tsx              # claims context
│   │   ├── theme-toggle.tsx                 # light/dark toggle
│   │   ├── effects/
│   │   │   ├── effect-host.tsx              # picks effect from mode
│   │   │   ├── confetti-background.tsx
│   │   │   ├── sparkles-background.tsx
│   │   │   └── snow-background.tsx
│   │   ├── providers.tsx                    # ThemeProvider + ModeProvider + ClaimsProvider
│   │   └── ui/                              # shadcn/ui generated (dialog, button, badge, …)
│   ├── data/
│   │   └── products.ts                      # typed product array
│   ├── lib/
│   │   ├── mode.ts                          # mode resolution (date → mode)
│   │   ├── mode-config.ts                   # mode metadata (copy, colours, effect)
│   │   ├── categories.ts                    # category metadata (label, colour, emoji)
│   │   ├── redis.ts                         # Upstash client
│   │   ├── ratelimit.ts                     # Upstash ratelimit utility
│   │   ├── claims-server.ts                 # server-side claim helpers
│   │   ├── claims-client.ts                 # client-side hook
│   │   └── utils.ts                         # cn() + small helpers
│   └── types/
│       └── product.ts                       # Product + PriceCategory types
├── tests/
│   ├── lib/mode.test.ts
│   ├── lib/categories.test.ts
│   ├── api/claims.test.ts
│   └── components/*.test.tsx                # add as components warrant
├── public/
│   └── products/                            # product images
├── docs/superpowers/
│   ├── specs/2026-05-29-darecky-pro-dominika-design.md
│   └── plans/2026-05-29-darecky-pro-dominika.md
├── .github/
│   └── dependabot.yml
├── biome.json
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── .env.local                               # Upstash creds (gitignored)
├── .env.example                             # template (committed)
├── .gitignore
└── README.md
```

**File responsibility principles:**
- `lib/mode.ts` is a pure function: `(date: Date) => Mode`. Easy to test.
- `lib/mode-config.ts` holds *content* (copy, colours, emoji). Easy to tweak.
- `claims-server.ts` is server-only (Redis calls). `claims-client.ts` only fetches/mutates via API.
- Components are split by responsibility, not technical layer.

---

## Phase 0 — Project Initialization

### Task 0.1: Scaffold Next.js 16 + TypeScript + Tailwind

**Files:**
- Create: project root via `create-next-app`

- [ ] **Step 1: Run scaffold**

The working directory already contains `docs/` and `CLAUDE.md` from the brainstorming phase — those must be preserved.

**If `create-next-app` refuses to scaffold into a non-empty directory:** do NOT delete or move the existing files. Stop and ask the user. Then use a strategy that scaffolds into a temporary directory and only copies in the scaffold output, leaving existing files intact.

A safe non-destructive approach (use this if the direct command fails):

```bash
cd "/tmp"
rm -rf darecky-scaffold
pnpm create next-app@latest darecky-scaffold \
  --typescript \
  --tailwind \
  --eslint=false \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack \
  --use-pnpm
# Copy everything (including hidden files) but DO NOT overwrite CLAUDE.md / docs.
cd "/Users/domino/Pracovní složky/private/private-coding/web-darecky"
rsync -a --ignore-existing /tmp/darecky-scaffold/ ./
rm -rf /tmp/darecky-scaffold
pnpm install
```

Otherwise the direct in-place command:

```bash
cd "/Users/domino/Pracovní složky/private/private-coding/web-darecky"
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --eslint=false \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack \
  --use-pnpm
```

Expected: `package.json`, `src/app/page.tsx`, etc. created. Verify `docs/` and `CLAUDE.md` still present.

- [ ] **Step 2: Verify dev server boots**

```bash
pnpm dev
```

Open `http://localhost:3000` — expect default Next.js page. Stop server (Ctrl-C).

- [ ] **Step 3: Initialize git and first commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 16 + TS + Tailwind"
```

- [ ] **Step 4: Add GitHub remote (no push)**

```bash
git branch -M main
git remote add origin https://github.com/tucnak-dominik/web-darecky.git
```

The user will run `git push -u origin main` from their Mac themselves once they're ready to publish the first batch.

### Task 0.2: Replace ESLint with Biome

**Files:**
- Create: `biome.json`
- Modify: `package.json` (scripts)
- Delete: any ESLint configs that came with scaffold

- [ ] **Step 1: Install Biome**

```bash
pnpm add -D --save-exact @biomejs/biome
pnpm biome init
```

- [ ] **Step 2: Configure `biome.json`** — replace contents:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "ignoreUnknown": false },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2 },
  "javascript": { "formatter": { "quoteStyle": "single", "semicolons": "always" } },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": { "useImportType": "error", "noNonNullAssertion": "off" },
      "suspicious": { "noExplicitAny": "warn" }
    }
  }
}
```

- [ ] **Step 3: Add scripts to `package.json`**

Replace `scripts` block:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "format": "biome format --write .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Run lint to verify**

```bash
pnpm lint
```

Expected: zero errors (maybe a few warnings is fine).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: switch from ESLint to Biome"
```

### Task 0.3: Install Vitest + React Testing Library

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`

- [ ] **Step 1: Install**

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 3: Create `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Smoke test — create `tests/sanity.test.ts`**

```ts
import { describe, expect, it } from 'vitest';

describe('sanity', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add Vitest + Testing Library setup"
```

### Task 0.4: Configure path alias + clean default page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center">
      <h1 className="text-3xl font-semibold">Dárečky pro Dominika 🎁</h1>
    </main>
  );
}
```

- [ ] **Step 2: Clean `src/app/globals.css`**

Keep Tailwind v4 import line(s) and CSS reset. Remove any demo CSS variables from scaffold.

```css
@import "tailwindcss";

@layer base {
  html {
    @apply antialiased;
  }
}
```

- [ ] **Step 3: Verify dev server**

```bash
pnpm dev
```

Expect heading "Dárečky pro Dominika 🎁". Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: clean scaffold default page"
```

---

## Phase 1 — shadcn/ui + Fonts

### Task 1.1: Initialize shadcn/ui

- [ ] **Step 1: Init shadcn**

```bash
pnpm dlx shadcn@latest init
```

Choose: TypeScript yes, style "default", base colour "neutral", CSS variables yes, alias `@/components`.

- [ ] **Step 2: Add base components**

```bash
pnpm dlx shadcn@latest add button badge dialog card switch dropdown-menu
```

Expected: files appear in `src/components/ui/`.

- [ ] **Step 3: Verify build still works**

```bash
pnpm build
```

Expected: success.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: init shadcn/ui + base components"
```

### Task 1.2: Add Geist fonts via next/font

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install Geist**

```bash
pnpm add geist
```

- [ ] **Step 2: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dárečky pro Dominika',
  description: 'Tipy na dárky pro Dominika — rodinný wishlist.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans bg-background text-foreground">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Add font-family bindings in `globals.css`**

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@layer base {
  html { @apply antialiased; }
}
```

- [ ] **Step 4: Verify**

```bash
pnpm dev
```

Open page — heading should use Geist (clean sans). Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: integrate Geist Sans/Mono fonts"
```

---

## Phase 2 — Types & Data Layer

### Task 2.1: Define Product + PriceCategory types

**Files:**
- Create: `src/types/product.ts`

- [ ] **Step 1: Create `src/types/product.ts`**

```ts
export type PriceCategory = 'small' | 'medium' | 'large' | 'premium';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: PriceCategory;
  images: string[];
  buyUrl: string;
  addedAt: string;
};
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Product types"
```

### Task 2.2: Define category metadata + tests

**Files:**
- Create: `src/lib/categories.ts`
- Create: `tests/lib/categories.test.ts`

- [ ] **Step 1: Write failing test in `tests/lib/categories.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { categories, categoryFor } from '@/lib/categories';

describe('categories', () => {
  it('returns small for price < 500', () => {
    expect(categoryFor(0)).toBe('small');
    expect(categoryFor(499)).toBe('small');
  });

  it('returns medium for 500–1999', () => {
    expect(categoryFor(500)).toBe('medium');
    expect(categoryFor(1999)).toBe('medium');
  });

  it('returns large for 2000–4999', () => {
    expect(categoryFor(2000)).toBe('large');
    expect(categoryFor(4999)).toBe('large');
  });

  it('returns premium for >= 5000', () => {
    expect(categoryFor(5000)).toBe('premium');
    expect(categoryFor(100000)).toBe('premium');
  });

  it('exposes label and emoji for all categories', () => {
    for (const cat of ['small', 'medium', 'large', 'premium'] as const) {
      expect(categories[cat].label).toBeTruthy();
      expect(categories[cat].emoji).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run — verify failure**

```bash
pnpm test tests/lib/categories.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/categories.ts`**

```ts
import type { PriceCategory } from '@/types/product';

export const categories: Record<
  PriceCategory,
  { label: string; emoji: string; accentClass: string }
> = {
  small:   { label: 'Drobnost',       emoji: '🍬', accentClass: 'accent-mint' },
  medium:  { label: 'Hezký dárek',    emoji: '🎁', accentClass: 'accent-coral' },
  large:   { label: 'Větší radost',   emoji: '🎀', accentClass: 'accent-lavender' },
  premium: { label: 'Splněné přání',  emoji: '✨', accentClass: 'accent-gold' },
};

export function categoryFor(price: number): PriceCategory {
  if (price < 500) return 'small';
  if (price < 2000) return 'medium';
  if (price < 5000) return 'large';
  return 'premium';
}
```

- [ ] **Step 4: Run tests — verify pass**

```bash
pnpm test tests/lib/categories.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add category metadata + price→category helper"
```

### Task 2.3: Seed initial products

**Files:**
- Create: `src/data/products.ts`
- Create: `public/products/` (placeholder image dir)

- [ ] **Step 1: Add a placeholder image**

Drop any small image as `public/products/_placeholder.png`.

```bash
mkdir -p public/products
curl -fsSL https://placehold.co/600x400/png -o public/products/_placeholder.png || true
```

- [ ] **Step 2: Create `src/data/products.ts`**

```ts
import type { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'placeholder-1',
    name: 'Příklad: Krásná knížka',
    description:
      'Tohle je ukázkový produkt — nahraď ho v `src/data/products.ts` reálnými dárky.',
    price: 399,
    category: 'small',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-29',
  },
  {
    id: 'placeholder-2',
    name: 'Příklad: Pohodová mikina',
    description: 'Druhý ukázkový produkt v kategorii Hezký dárek.',
    price: 1290,
    category: 'medium',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-29',
  },
  {
    id: 'placeholder-3',
    name: 'Příklad: Designový stojánek',
    description: 'Třetí ukázkový produkt v kategorii Větší radost.',
    price: 2900,
    category: 'large',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-28',
  },
  {
    id: 'placeholder-4',
    name: 'Příklad: Luxusní sluchátka',
    description: 'Čtvrtý ukázkový produkt v kategorii Splněné přání.',
    price: 8990,
    category: 'premium',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-25',
  },
];
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: seed products data with placeholders"
```

---

## Phase 3 — Seasonal Mode Core

### Task 3.1: Mode resolver — failing tests

**Files:**
- Create: `tests/lib/mode.test.ts`

- [ ] **Step 1: Write `tests/lib/mode.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { resolveMode } from '@/lib/mode';

const d = (yyyymmdd: string) => new Date(`${yyyymmdd}T12:00:00+02:00`);

describe('resolveMode', () => {
  it('returns "nameday" on 4.8. itself (event day = mode still active)', () => {
    expect(resolveMode(d('2026-08-04'))).toBe('nameday');
  });

  it('switches to "birthday" on 5.8. (day after nameday)', () => {
    expect(resolveMode(d('2026-08-05'))).toBe('birthday');
  });

  it('returns "birthday" on 9.11. (event day still active)', () => {
    expect(resolveMode(d('2026-11-09'))).toBe('birthday');
  });

  it('switches to "christmas" on 10.11.', () => {
    expect(resolveMode(d('2026-11-10'))).toBe('christmas');
  });

  it('returns "christmas" on 24.12.', () => {
    expect(resolveMode(d('2026-12-24'))).toBe('christmas');
  });

  it('switches to "nameday" on 25.12.', () => {
    expect(resolveMode(d('2026-12-25'))).toBe('nameday');
  });

  it('returns "nameday" deep in January (cycle wraps year)', () => {
    expect(resolveMode(d('2027-01-15'))).toBe('nameday');
  });

  it('returns "nameday" on 3.8. (still before nameday event)', () => {
    expect(resolveMode(d('2026-08-03'))).toBe('nameday');
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test tests/lib/mode.test.ts
```

Expected: module not found.

### Task 3.2: Mode resolver — implementation

**Files:**
- Create: `src/lib/mode.ts`

- [ ] **Step 1: Create `src/lib/mode.ts`**

```ts
export type Mode = 'birthday' | 'nameday' | 'christmas';

const EVENTS: { mode: Mode; month: number; day: number }[] = [
  { mode: 'nameday',   month: 8,  day: 4  },
  { mode: 'birthday',  month: 11, day: 9  },
  { mode: 'christmas', month: 12, day: 24 },
];

function toPragueDate(date: Date): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return { y: Number(parts.year), m: Number(parts.month), d: Number(parts.day) };
}

const dayOfYear = (m: number, d: number) => m * 31 + d;

export function resolveMode(date: Date): Mode {
  const { m, d } = toPragueDate(date);
  const today = dayOfYear(m, d);

  const sorted = [...EVENTS].sort(
    (a, b) => dayOfYear(a.month, a.day) - dayOfYear(b.month, b.day),
  );

  for (const event of sorted) {
    if (today <= dayOfYear(event.month, event.day)) return event.mode;
  }
  return sorted[0].mode;
}
```

- [ ] **Step 2: Run tests**

```bash
pnpm test tests/lib/mode.test.ts
```

Expected: 8 tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement seasonal mode resolver"
```

### Task 3.3: Mode configuration (copy + visuals)

**Files:**
- Create: `src/lib/mode-config.ts`

- [ ] **Step 1: Create `src/lib/mode-config.ts`**

```ts
import type { Mode } from './mode';

export type ModeConfig = {
  emoji: string;
  label: string;
  heroTitle: string;
  heroSubtitle: string;
  cssClass: `mode-${Mode}`;
  effect: 'confetti' | 'sparkles' | 'snow';
};

export const modeConfig: Record<Mode, ModeConfig> = {
  birthday: {
    emoji: '🎂',
    label: 'Narozeniny',
    heroTitle: 'Dominik má narozky! 🎂 Tady je inspirace…',
    heroSubtitle: '…na to, co by mu udělalo radost.',
    cssClass: 'mode-birthday',
    effect: 'confetti',
  },
  nameday: {
    emoji: '🎉',
    label: 'Svátek',
    heroTitle: 'Dominik má svátek! 🎉',
    heroSubtitle: 'Tradice je tradice — drobnost potěší.',
    cssClass: 'mode-nameday',
    effect: 'sparkles',
  },
  christmas: {
    emoji: '🎄',
    label: 'Vánoce',
    heroTitle: 'Ho ho ho! 🎄 Vánoce klepou na dveře',
    heroSubtitle: 'Ať se ti tipy hodí pod stromeček.',
    cssClass: 'mode-christmas',
    effect: 'snow',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add mode visual + copy configuration"
```

### Task 3.4: Apply mode class to `<html>` server-side

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { resolveMode } from '@/lib/mode';
import { modeConfig } from '@/lib/mode-config';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dárečky pro Dominika',
  description: 'Tipy na dárky pro Dominika — rodinný wishlist.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const mode = resolveMode(new Date());
  const modeClass = modeConfig[mode].cssClass;

  return (
    <html
      lang="cs"
      className={`${GeistSans.variable} ${GeistMono.variable} ${modeClass}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev**

```bash
pnpm dev
```

Inspect `<html>` in DevTools — expect class like `mode-nameday` (depending on today's date). Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: apply seasonal mode class on root html"
```

---

## Phase 4 — Theme (Light/Dark) + Providers

### Task 4.1: Install and wire next-themes

**Files:**
- Create: `src/components/providers.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install next-themes**

```bash
pnpm add next-themes
```

- [ ] **Step 2: Create `src/components/providers.tsx`**

```tsx
'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Wrap layout** — update `src/app/layout.tsx` body:

```tsx
<body className="font-sans bg-background text-foreground">
  <Providers>{children}</Providers>
</body>
```

(Add `import { Providers } from '@/components/providers';` at top.)

- [ ] **Step 4: Verify dev — no errors**

```bash
pnpm dev
```

Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire next-themes provider"
```

### Task 4.2: ThemeToggle component

**Files:**
- Create: `src/components/theme-toggle.tsx`

- [ ] **Step 1: Install Lucide**

```bash
pnpm add lucide-react
```

- [ ] **Step 2: Create `src/components/theme-toggle.tsx`**

```tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? (resolvedTheme ?? theme) : 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Přepnout na ${next === 'dark' ? 'tmavý' : 'světlý'} režim`}
      onClick={() => setTheme(next)}
    >
      {mounted && current === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add theme toggle component"
```

---

## Phase 5 — Mode Override + Mode Context

### Task 5.1: Mode override context + hook

**Files:**
- Create: `src/components/mode-provider.tsx`

- [ ] **Step 1: Create `src/components/mode-provider.tsx`**

```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Mode } from '@/lib/mode';
import { modeConfig } from '@/lib/mode-config';

type ModeContextValue = {
  serverMode: Mode;
  effectiveMode: Mode;
  override: Mode | null;
  setOverride: (m: Mode | null) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = 'mode-override';

export function ModeProvider({
  serverMode,
  children,
}: { serverMode: Mode; children: React.ReactNode }) {
  const [override, setOverrideState] = useState<Mode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in modeConfig) setOverrideState(stored as Mode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const allClasses = Object.values(modeConfig).map((c) => c.cssClass);
    for (const c of allClasses) root.classList.remove(c);
    const active = override ?? serverMode;
    root.classList.add(modeConfig[active].cssClass);
  }, [override, serverMode]);

  const setOverride = (m: Mode | null) => {
    if (m) localStorage.setItem(STORAGE_KEY, m);
    else localStorage.removeItem(STORAGE_KEY);
    setOverrideState(m);
  };

  return (
    <ModeContext.Provider
      value={{
        serverMode,
        effectiveMode: override ?? serverMode,
        override,
        setOverride,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
```

- [ ] **Step 2: Wire into `providers.tsx`** — replace contents:

```tsx
'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import type { Mode } from '@/lib/mode';
import { ModeProvider } from '@/components/mode-provider';

export function Providers({
  children,
  serverMode,
}: { children: ReactNode; serverMode: Mode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ModeProvider serverMode={serverMode}>{children}</ModeProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Pass serverMode from layout** — update `layout.tsx` body:

```tsx
<body className="font-sans bg-background text-foreground">
  <Providers serverMode={mode}>{children}</Providers>
</body>
```

- [ ] **Step 4: Verify dev**

```bash
pnpm dev
```

Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add mode context + override persistence"
```

### Task 5.2: Mode switcher dropdown (testing)

**Files:**
- Create: `src/components/mode-switcher.tsx`

- [ ] **Step 1: Create `src/components/mode-switcher.tsx`**

```tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Mode } from '@/lib/mode';
import { modeConfig } from '@/lib/mode-config';
import { useMode } from './mode-provider';

const ORDER: Mode[] = ['birthday', 'nameday', 'christmas'];

export function ModeSwitcher() {
  const { effectiveMode, override, setOverride } = useMode();
  const label = override
    ? `${modeConfig[effectiveMode].emoji} ${modeConfig[effectiveMode].label}`
    : `Auto: ${modeConfig[effectiveMode].emoji} ${modeConfig[effectiveMode].label}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          {label} <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setOverride(null)}>
          Auto (dle data)
        </DropdownMenuItem>
        {ORDER.map((m) => (
          <DropdownMenuItem key={m} onSelect={() => setOverride(m)}>
            {modeConfig[m].emoji} {modeConfig[m].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add mode override dropdown"
```

---

## Phase 6 — Layout Shell (Header, Hero, Footer)

### Task 6.1: Header component

**Files:**
- Create: `src/components/header.tsx`

- [ ] **Step 1: Create `src/components/header.tsx`**

```tsx
import { ModeSwitcher } from './mode-switcher';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-2">
        <a href="#top" className="font-semibold text-lg sm:text-xl">
          🎁 Dárečky pro Dominika
        </a>
        <div className="flex items-center gap-1">
          <ModeSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add sticky header"
```

### Task 6.2: Hero component

**Files:**
- Create: `src/components/hero.tsx`

- [ ] **Step 1: Create `src/components/hero.tsx`**

```tsx
'use client';

import { modeConfig } from '@/lib/mode-config';
import { useMode } from './mode-provider';

export function Hero() {
  const { effectiveMode } = useMode();
  const cfg = modeConfig[effectiveMode];

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:pt-20 sm:pb-12 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance">
        {cfg.heroTitle}
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground text-balance">
        {cfg.heroSubtitle}
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add mode-aware hero section"
```

### Task 6.3: Footer component

**Files:**
- Create: `src/components/footer.tsx`

- [ ] **Step 1: Create `src/components/footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
      Made with <span aria-label="láska">❤️</span> by Dominik · {new Date().getFullYear()}
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add footer"
```

### Task 6.4: Compose page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-dvh">
        <Hero />
        {/* product grid follows in next phase */}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify dev — see hero, header, footer**

```bash
pnpm dev
```

Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: compose page shell"
```

---

## Phase 7 — Product Grid (Static)

### Task 7.1: ProductCard component

**Files:**
- Create: `src/components/product-card.tsx`

- [ ] **Step 1: Create `src/components/product-card.tsx`**

```tsx
'use client';

import Image from 'next/image';
import { categories } from '@/lib/categories';
import type { Product } from '@/types/product';

type Props = {
  product: Product;
  onOpen: (product: Product) => void;
};

const priceFmt = new Intl.NumberFormat('cs-CZ');

export function ProductCard({ product, onOpen }: Props) {
  const cat = categories[product.category];

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="group relative text-left bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs bg-background/80 backdrop-blur-sm border border-border/40">
        {cat.emoji} {cat.label}
      </div>
      <div className="aspect-[4/3] relative bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-medium text-base line-clamp-2">{product.name}</h3>
        <div className="font-mono text-sm text-muted-foreground">
          {priceFmt.format(product.price)} Kč
        </div>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add product card component"
```

### Task 7.2: ProductGrid — orchestrator with filter state

**Files:**
- Create: `src/components/product-grid.tsx`

- [ ] **Step 1: Create `src/components/product-grid.tsx`**

```tsx
'use client';

import { useMemo, useState } from 'react';
import { products as allProducts } from '@/data/products';
import type { PriceCategory, Product } from '@/types/product';
import { FilterBar } from './filter-bar';
import { ProductCard } from './product-card';
import { ProductModal } from './product-modal';

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<PriceCategory | 'all'>('all');
  const [hideClaimed, setHideClaimed] = useState(false);
  const [openProduct, setOpenProduct] = useState<Product | null>(null);

  const sorted = useMemo(
    () =>
      [...allProducts].sort((a, b) =>
        a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0,
      ),
    [],
  );

  const filtered = useMemo(
    () =>
      sorted.filter((p) => activeCategory === 'all' || p.category === activeCategory),
    [sorted, activeCategory],
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        hideClaimed={hideClaimed}
        onHideClaimedChange={setHideClaimed}
      />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Tady je prázdno jak v penzijku 💸 — zkus jinou kategorii!
        </div>
      )}

      <ProductModal
        product={openProduct}
        onClose={() => setOpenProduct(null)}
      />
    </section>
  );
}
```

Note: this references `FilterBar` and `ProductModal` — created next.

- [ ] **Step 2: Commit (don't run yet — will fail to compile until next tasks)**

```bash
git add -A
git commit -m "feat: add product grid orchestrator (compiles after filter+modal added)"
```

### Task 7.3: FilterBar component

**Files:**
- Create: `src/components/filter-bar.tsx`

- [ ] **Step 1: Create `src/components/filter-bar.tsx`**

```tsx
'use client';

import { categories } from '@/lib/categories';
import type { PriceCategory } from '@/types/product';
import { Switch } from '@/components/ui/switch';

type Props = {
  activeCategory: PriceCategory | 'all';
  onCategoryChange: (c: PriceCategory | 'all') => void;
  hideClaimed: boolean;
  onHideClaimedChange: (v: boolean) => void;
};

const ORDER: PriceCategory[] = ['small', 'medium', 'large', 'premium'];

export function FilterBar({
  activeCategory,
  onCategoryChange,
  hideClaimed,
  onHideClaimedChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        <PillButton
          active={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        >
          Vše
        </PillButton>
        {ORDER.map((c) => (
          <PillButton
            key={c}
            active={activeCategory === c}
            onClick={() => onCategoryChange(c)}
          >
            {categories[c].emoji} {categories[c].label}
          </PillButton>
        ))}
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <Switch checked={hideClaimed} onCheckedChange={onHideClaimedChange} />
        <span>Skrýt zamluvené</span>
      </label>
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full text-sm border transition-colors',
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-transparent border-border/60 hover:bg-muted',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add filter bar"
```

### Task 7.4: ProductModal — placeholder (full impl Phase 8)

**Files:**
- Create: `src/components/product-modal.tsx`

- [ ] **Step 1: Create placeholder `src/components/product-modal.tsx`**

```tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Product } from '@/types/product';

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: Props) {
  const open = product !== null;
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product?.name ?? ''}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {product?.description}
        </p>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Add ProductGrid to page** — modify `src/app/page.tsx`:

```tsx
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-dvh">
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Configure Next.js for placeholder image domain**

Modify `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Verify dev — see 4 cards**

```bash
pnpm dev
```

Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire product grid into page"
```

---

## Phase 8 — Product Modal (Full)

### Task 8.1: Flesh out ProductModal

**Files:**
- Modify: `src/components/product-modal.tsx`

- [ ] **Step 1: Replace `src/components/product-modal.tsx`**

```tsx
'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import type { Product } from '@/types/product';

type Props = {
  product: Product | null;
  onClose: () => void;
};

const priceFmt = new Intl.NumberFormat('cs-CZ');

export function ProductModal({ product, onClose }: Props) {
  const open = product !== null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {product && (
          <>
            <div className="relative aspect-[4/3] w-full bg-muted">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width:640px) 640px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-6 space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs border border-border/60">
                    {categories[product.category].emoji} {categories[product.category].label}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{product.name}</DialogTitle>
                <DialogDescription className="font-mono text-lg text-foreground">
                  {priceFmt.format(product.price)} Kč
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="ghost" onClick={onClose}>Zavřít</Button>
                <Button asChild>
                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🛒 Koupit u prodejce <ExternalLink className="size-4 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Verify dev — open modal**

```bash
pnpm dev
```

Click a card — modal opens with image, name, price, description, two buttons. ESC closes. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: complete product modal with image + actions"
```

---

## Phase 9 — Reservations: Upstash + API

### Task 9.1: Provision Upstash Redis via Vercel Marketplace

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Install Vercel CLI (user step, not Claude's)**

User runs from own terminal:

```bash
npm i -g vercel
vercel login
```

- [ ] **Step 2: Link the project**

```bash
vercel link
```

Follow prompts — new project, scope "personal", framework Next.js.

- [ ] **Step 3: Add Upstash Redis via Marketplace**

```bash
vercel integrations add upstash
```

Or via dashboard: project → Storage → "Connect Database" → Upstash for Redis → free tier.

This auto-provisions and injects env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

- [ ] **Step 4: Pull env to local**

```bash
vercel env pull .env.local
```

Verify `.env.local` exists with `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

- [ ] **Step 5: Create `.env.example`**

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 6: Commit**

```bash
git add .env.example
git commit -m "chore: add env example for Upstash"
```

### Task 9.2: Install Upstash SDK + client wrapper

**Files:**
- Create: `src/lib/redis.ts`

- [ ] **Step 1: Install**

```bash
pnpm add @upstash/redis
```

- [ ] **Step 2: Create `src/lib/redis.ts`**

```ts
import 'server-only';
import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Upstash Redis client"
```

### Task 9.3: Server-side claim helpers + tests

**Files:**
- Create: `src/lib/claims-server.ts`
- Create: `tests/api/claims.test.ts`

- [ ] **Step 1: Write failing tests `tests/api/claims.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const store = new Map<string, unknown>();

vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: unknown) => {
      store.set(key, value);
      return 'OK';
    }),
    del: vi.fn(async (key: string) => {
      const had = store.delete(key);
      return had ? 1 : 0;
    }),
    keys: vi.fn(async (pattern: string) => {
      const prefix = pattern.replace('*', '');
      return [...store.keys()].filter((k) => k.startsWith(prefix));
    }),
    mget: vi.fn(async (...keys: string[]) =>
      keys.map((k) => store.get(k) ?? null),
    ),
  },
}));

import {
  claimProduct,
  getAllClaims,
  isClaimed,
  unclaimProduct,
} from '@/lib/claims-server';

describe('claims server helpers', () => {
  beforeEach(() => store.clear());
  afterEach(() => vi.clearAllMocks());

  it('returns empty object when nothing is claimed', async () => {
    expect(await getAllClaims()).toEqual({});
  });

  it('claims a product', async () => {
    await claimProduct('p1');
    expect(await isClaimed('p1')).toBe(true);
    const all = await getAllClaims();
    expect(all.p1).toBeDefined();
    expect(typeof all.p1.claimedAt).toBe('string');
  });

  it('unclaims a product', async () => {
    await claimProduct('p2');
    await unclaimProduct('p2');
    expect(await isClaimed('p2')).toBe(false);
  });

  it('lists multiple claims', async () => {
    await claimProduct('p1');
    await claimProduct('p2');
    const all = await getAllClaims();
    expect(Object.keys(all).sort()).toEqual(['p1', 'p2']);
  });
});
```

- [ ] **Step 2: Run — verify failure**

```bash
pnpm test tests/api/claims.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/claims-server.ts`**

```ts
import 'server-only';
import { redis } from './redis';

export type ClaimState = { claimedAt: string };
export type AllClaims = Record<string, ClaimState>;

const keyFor = (productId: string) => `claim:${productId}`;

export async function isClaimed(productId: string): Promise<boolean> {
  const v = await redis.get<ClaimState>(keyFor(productId));
  return v !== null && v !== undefined;
}

export async function claimProduct(productId: string): Promise<ClaimState> {
  const state: ClaimState = { claimedAt: new Date().toISOString() };
  await redis.set(keyFor(productId), state);
  return state;
}

export async function unclaimProduct(productId: string): Promise<void> {
  await redis.del(keyFor(productId));
}

export async function getAllClaims(): Promise<AllClaims> {
  const keys = await redis.keys('claim:*');
  if (keys.length === 0) return {};
  const values = await redis.mget<ClaimState[]>(...keys);
  const out: AllClaims = {};
  keys.forEach((k, i) => {
    const id = k.slice('claim:'.length);
    const v = values[i];
    if (v) out[id] = v;
  });
  return out;
}
```

- [ ] **Step 4: Run tests — verify pass**

```bash
pnpm test tests/api/claims.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add server-side claim helpers with tests"
```

### Task 9.4: API routes

**Files:**
- Create: `src/app/api/claims/route.ts`
- Create: `src/app/api/claim/[productId]/route.ts`

- [ ] **Step 1: Create `src/app/api/claims/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { getAllClaims } from '@/lib/claims-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const claims = await getAllClaims();
  return NextResponse.json(claims, {
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    },
  });
}
```

- [ ] **Step 2: Create `src/app/api/claim/[productId]/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { products } from '@/data/products';
import { claimProduct, isClaimed, unclaimProduct } from '@/lib/claims-server';

const validIds = new Set(products.map((p) => p.id));

function validate(id: string) {
  if (!validIds.has(id)) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 404 });
  }
  return null;
}

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  if (await isClaimed(productId)) {
    return NextResponse.json({ error: 'Already claimed' }, { status: 409 });
  }
  const state = await claimProduct(productId);
  return NextResponse.json({ productId, ...state });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  await unclaimProduct(productId);
  return NextResponse.json({ productId, claimedAt: null });
}
```

- [ ] **Step 3: Smoke-test API manually**

```bash
pnpm dev
```

In another terminal:

```bash
curl http://localhost:3000/api/claims
curl -X POST http://localhost:3000/api/claim/placeholder-1
curl http://localhost:3000/api/claims
curl -X DELETE http://localhost:3000/api/claim/placeholder-1
```

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add claim API routes"
```

---

## Phase 10 — Reservations: Client Integration

### Task 10.1: Claims client hook

**Files:**
- Create: `src/lib/claims-client.ts`

- [ ] **Step 1: Create `src/lib/claims-client.ts`**

```ts
'use client';

import { useCallback, useEffect, useState } from 'react';

export type ClaimMap = Record<string, { claimedAt: string }>;

export function useClaims() {
  const [claims, setClaims] = useState<ClaimMap>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/claims', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load claims');
      const data = (await res.json()) as ClaimMap;
      setClaims(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  const claim = useCallback(async (productId: string) => {
    setClaims((c) => ({ ...c, [productId]: { claimedAt: new Date().toISOString() } }));
    const res = await fetch(`/api/claim/${productId}`, { method: 'POST' });
    if (!res.ok) await refresh();
  }, [refresh]);

  const unclaim = useCallback(async (productId: string) => {
    setClaims((c) => {
      const { [productId]: _removed, ...rest } = c;
      return rest;
    });
    const res = await fetch(`/api/claim/${productId}`, { method: 'DELETE' });
    if (!res.ok) await refresh();
  }, [refresh]);

  return { claims, loading, refresh, claim, unclaim };
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add claims client hook with optimistic updates"
```

### Task 10.2: Claims context (shared state)

**Files:**
- Create: `src/components/claims-provider.tsx`
- Modify: `src/components/providers.tsx`

- [ ] **Step 1: Create `src/components/claims-provider.tsx`**

```tsx
'use client';

import { createContext, useContext } from 'react';
import { useClaims } from '@/lib/claims-client';

type ClaimsCtx = ReturnType<typeof useClaims>;

const Ctx = createContext<ClaimsCtx | null>(null);

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
  const value = useClaims();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClaimsContext() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useClaimsContext must be used within ClaimsProvider');
  return v;
}
```

- [ ] **Step 2: Add to `providers.tsx`**

```tsx
'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import type { Mode } from '@/lib/mode';
import { ModeProvider } from '@/components/mode-provider';
import { ClaimsProvider } from '@/components/claims-provider';

export function Providers({
  children,
  serverMode,
}: { children: ReactNode; serverMode: Mode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ModeProvider serverMode={serverMode}>
        <ClaimsProvider>{children}</ClaimsProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add claims provider for shared state"
```

### Task 10.3: ClaimButton component + confirm dialog

**Files:**
- Create: `src/components/claim-button.tsx`

- [ ] **Step 1: Add shadcn alert-dialog**

```bash
pnpm dlx shadcn@latest add alert-dialog
```

- [ ] **Step 2: Create `src/components/claim-button.tsx`**

```tsx
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useClaimsContext } from './claims-provider';

type Props = {
  productId: string;
  className?: string;
};

export function ClaimButton({ productId, className }: Props) {
  const { claims, claim, unclaim } = useClaimsContext();
  const isClaimed = Boolean(claims[productId]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!isClaimed) {
    return (
      <Button
        size="sm"
        variant="secondary"
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          claim(productId);
        }}
      >
        ☐ Zamluvit pro Dominika
      </Button>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          setConfirmOpen(true);
        }}
      >
        ↩ Uvolnit rezervaci
      </Button>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu uvolnit?</AlertDialogTitle>
            <AlertDialogDescription>
              Pokud tu věc nekupuješ ty, někdo jiný ji možná už shání.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={() => unclaim(productId)}>
              Ano, uvolnit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add claim button with confirm dialog"
```

### Task 10.4: Wire claims into card + modal + filter

**Files:**
- Modify: `src/components/product-card.tsx`
- Modify: `src/components/product-modal.tsx`
- Modify: `src/components/product-grid.tsx`

- [ ] **Step 1: Update `product-card.tsx`** — replace the file:

```tsx
'use client';

import Image from 'next/image';
import { categories } from '@/lib/categories';
import type { Product } from '@/types/product';
import { useClaimsContext } from './claims-provider';
import { ClaimButton } from './claim-button';

type Props = {
  product: Product;
  onOpen: (product: Product) => void;
};

const priceFmt = new Intl.NumberFormat('cs-CZ');

export function ProductCard({ product, onOpen }: Props) {
  const cat = categories[product.category];
  const { claims } = useClaimsContext();
  const claimed = Boolean(claims[product.id]);

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className={[
        'group relative text-left bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all',
        claimed ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs bg-background/80 backdrop-blur-sm border border-border/40">
        {cat.emoji} {cat.label}
      </div>
      {claimed && (
        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs bg-foreground text-background">
          💝 Zamluveno
        </div>
      )}
      <div className="aspect-[4/3] relative bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-medium text-base line-clamp-2">{product.name}</h3>
          <div className="font-mono text-sm text-muted-foreground">
            {priceFmt.format(product.price)} Kč
          </div>
        </div>
        <ClaimButton productId={product.id} />
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Update `product-modal.tsx`** — add ClaimButton above CTAs. Replace footer block:

```tsx
<div className="flex flex-wrap gap-2 justify-end pt-2">
  <ClaimButton productId={product.id} />
  <Button variant="ghost" onClick={onClose}>Zavřít</Button>
  <Button asChild>
    <a href={product.buyUrl} target="_blank" rel="noopener noreferrer">
      🛒 Koupit u prodejce <ExternalLink className="size-4 ml-1" />
    </a>
  </Button>
</div>
```

Add the import at top: `import { ClaimButton } from './claim-button';`

- [ ] **Step 3: Wire `hideClaimed` in `product-grid.tsx`** — modify `filtered` memo:

```tsx
import { useClaimsContext } from './claims-provider';

// inside the component:
const { claims } = useClaimsContext();

const filtered = useMemo(
  () =>
    sorted.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (hideClaimed && claims[p.id]) return false;
      return true;
    }),
  [sorted, activeCategory, hideClaimed, claims],
);
```

- [ ] **Step 4: Verify in browser**

```bash
pnpm dev
```

Test: claim a card → card greys out + badge appears. Toggle "Skrýt zamluvené" → card hides. Click "Uvolnit" → confirm dialog → confirm → card returns. Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire claim UI into cards, modal, and filter"
```

---

## Phase 11 — Seasonal Background Effects

### Task 11.1: Effect base + reduced motion

**Files:**
- Create: `src/components/effects/effect-host.tsx`

- [ ] **Step 1: Install canvas-confetti**

```bash
pnpm add canvas-confetti
pnpm add -D @types/canvas-confetti
```

- [ ] **Step 2: Create `src/components/effects/effect-host.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/components/mode-provider';
import { modeConfig } from '@/lib/mode-config';
import { ConfettiBackground } from './confetti-background';
import { SparklesBackground } from './sparkles-background';
import { SnowBackground } from './snow-background';

export function EffectHost() {
  const { effectiveMode } = useMode();
  const effect = modeConfig[effectiveMode].effect;
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reduced) return null;

  switch (effect) {
    case 'confetti': return <ConfettiBackground />;
    case 'sparkles': return <SparklesBackground />;
    case 'snow':     return <SnowBackground />;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add effect host with reduced-motion support"
```

### Task 11.2: Snow background (CSS only)

**Files:**
- Create: `src/components/effects/snow-background.tsx`

- [ ] **Step 1: Create `src/components/effects/snow-background.tsx`**

```tsx
'use client';

const FLAKES = Array.from({ length: 40 }, (_, i) => i);

export function SnowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {FLAKES.map((i) => {
        const left = (i * 37) % 100;
        const delay = (i % 10) * 0.7;
        const duration = 8 + (i % 7);
        const size = 6 + (i % 8);
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `-10%`,
              width: size,
              height: size,
              animation: `snowfall ${duration}s linear ${delay}s infinite`,
            }}
            className="absolute rounded-full bg-white/70 dark:bg-white/40"
          />
        );
      })}
      <style>{`
        @keyframes snowfall {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(120vh) translateX(40px) rotate(360deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add CSS snow background effect"
```

### Task 11.3: Sparkles background (CSS only)

**Files:**
- Create: `src/components/effects/sparkles-background.tsx`

- [ ] **Step 1: Create `src/components/effects/sparkles-background.tsx`**

```tsx
'use client';

const SPARKLES = Array.from({ length: 30 }, (_, i) => i);

export function SparklesBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {SPARKLES.map((i) => {
        const left = (i * 53) % 100;
        const top = (i * 31) % 100;
        const delay = (i % 8) * 0.4;
        const duration = 3 + (i % 4);
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
            }}
            className="absolute size-1.5 rounded-full bg-amber-300/80 shadow-[0_0_8px_2px_rgba(251,191,36,0.6)]"
          />
        );
      })}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.6); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add CSS sparkles background effect"
```

### Task 11.4: Confetti background (passive ambient)

**Files:**
- Create: `src/components/effects/confetti-background.tsx`

- [ ] **Step 1: Create `src/components/effects/confetti-background.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function ConfettiBackground() {
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      confetti({
        particleCount: 3,
        startVelocity: 25,
        spread: 60,
        ticks: 120,
        origin: { x: Math.random(), y: 0 },
        colors: ['#f9a8d4', '#67e8f9', '#fde68a', '#bbf7d0'],
        gravity: 0.6,
        scalar: 0.7,
        disableForReducedMotion: true,
      });
      setTimeout(tick, 600);
    };
    tick();
    return () => { cancelled = true; };
  }, []);

  return null;
}
```

- [ ] **Step 2: Mount EffectHost in page** — modify `src/app/page.tsx`:

```tsx
import { EffectHost } from '@/components/effects/effect-host';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';

export default function Home() {
  return (
    <>
      <EffectHost />
      <Header />
      <main className="relative z-10 min-h-dvh">
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify visually**

```bash
pnpm dev
```

Use mode override in header to flip between modes — snow / sparkles / confetti should change. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add confetti ambient effect + mount EffectHost"
```

### Task 11.5: Confetti burst on claim

**Files:**
- Modify: `src/components/claim-button.tsx`

- [ ] **Step 1: Add a burst on successful claim**

Update the "not claimed" branch's `onClick`:

```tsx
import confetti from 'canvas-confetti';

onClick={(e) => {
  e.stopPropagation();
  claim(productId);
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.7 },
    disableForReducedMotion: true,
  });
}}
```

- [ ] **Step 2: Verify in browser**

Claim a card → small burst. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add confetti burst on claim"
```

---

## Phase 12 — Mode + Category Accent Colours

### Task 12.1: Define CSS variables for mode + category accents

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Extend `globals.css`**

Add below the existing content:

```css
@layer base {
  :root {
    --accent: 350 85% 65%;
  }
  .dark { --accent: 350 75% 60%; }

  .mode-birthday  { --accent: 330 90% 70%; }
  .mode-nameday   { --accent:  35 90% 60%; }
  .mode-christmas { --accent:   0 65% 50%; }

  .accent-mint     { --cat: 160 60% 45%; }
  .accent-coral    { --cat:  15 85% 60%; }
  .accent-lavender { --cat: 265 50% 65%; }
  .accent-gold     { --cat:  45 90% 55%; }
}
```

- [ ] **Step 2: Use the variables in category badges (optional polish)**

Update `product-card.tsx` category badge to use the category accent:

```tsx
<div
  className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm border ${cat.accentClass}`}
  style={{
    backgroundColor: 'hsl(var(--cat) / 0.15)',
    borderColor: 'hsl(var(--cat) / 0.4)',
    color: 'hsl(var(--cat))',
  }}
>
  {cat.emoji} {cat.label}
</div>
```

- [ ] **Step 3: Verify visually — different colour per category**

```bash
pnpm dev
```

Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add mode + category accent CSS variables"
```

---

## Phase 13 — Mobile Polish

### Task 13.1: Bottom-sheet variant of modal on mobile

**Files:**
- Modify: `src/components/product-modal.tsx`

- [ ] **Step 1: Override Radix Dialog centering on mobile**

shadcn's default `DialogContent` uses `fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`. We override those with `!`-important utilities on small screens to anchor to the bottom. Replace the `<DialogContent>` opening tag in `product-modal.tsx`:

```tsx
<DialogContent
  className="
    p-0 overflow-hidden gap-0
    sm:max-w-2xl sm:rounded-lg
    max-sm:!left-0 max-sm:!right-0 max-sm:!top-auto max-sm:!bottom-0
    max-sm:!translate-x-0 max-sm:!translate-y-0
    max-sm:!w-full max-sm:!max-w-none
    max-sm:!rounded-t-2xl max-sm:!rounded-b-none
  "
>
```

- [ ] **Step 2: Test on narrow viewport via DevTools**

```bash
pnpm dev
```

Resize browser to ~360 px → click a card → modal anchored to bottom. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: bottom-sheet modal on mobile"
```

### Task 13.2: Verify touch target sizes + tap interactions

- [ ] **Step 1: Audit interactive elements**

Open in DevTools mobile emulator. All buttons should be at least 44×44 px. If any are smaller, increase via Tailwind utility (`size-11`, `p-3`, etc.).

- [ ] **Step 2: Commit any tweaks**

```bash
git add -A && git commit -m "fix: ensure 44px touch targets on mobile" || echo "no changes"
```

---

## Phase 14 — SEO, Meta, PWA-light

### Task 14.1: Meta + Open Graph

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Expand metadata in `layout.tsx`**

```tsx
export const metadata: Metadata = {
  title: 'Dárečky pro Dominika',
  description: 'Tipy na dárky pro Dominika — rodinný wishlist s rezervacemi.',
  metadataBase: new URL('https://dareckyprodominika.cz'),
  openGraph: {
    title: 'Dárečky pro Dominika',
    description: 'Tipy na dárky pro Dominika — rodinný wishlist s rezervacemi.',
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://dareckyprodominika.cz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dárečky pro Dominika',
    description: 'Rodinný wishlist s rezervacemi.',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add OG and Twitter metadata"
```

### Task 14.2: Dynamic OG image

**Files:**
- Create: `src/app/opengraph-image.tsx`

- [ ] **Step 1: Create `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dárečky pro Dominika';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 80,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fca5a5 100%)',
          color: '#1f2937',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 24 }}>🎁</div>
        <div>Dárečky pro Dominika</div>
        <div style={{ fontSize: 36, fontWeight: 400, marginTop: 12, opacity: 0.8 }}>
          Tipy na dárky · Rodinný wishlist
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add dynamic OG image"
```

### Task 14.3: Favicon + manifest

**Files:**
- Create: `src/app/icon.tsx`
- Create: `src/app/manifest.ts`

- [ ] **Step 1: Create `src/app/icon.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          background: '#fef3c7',
        }}
      >
        🎁
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Create `src/app/manifest.ts`**

```ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dárečky pro Dominika',
    short_name: 'Dárečky',
    description: 'Rodinný wishlist.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#fef3c7',
    icons: [{ src: '/icon', sizes: '32x32', type: 'image/png' }],
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add favicon and web manifest"
```

---

## Phase 14b — Security & Hardening

### Task 14b.1: Security headers in `next.config.ts`

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.upstash.io",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  images: { remotePatterns: [] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify headers in dev**

```bash
pnpm dev
```

In another terminal:

```bash
curl -sI http://localhost:3000 | grep -iE 'content-security-policy|x-frame|referrer|permissions|x-content-type'
```

Expected: all 5 headers present. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(security): add CSP and hardening headers"
```

### Task 14b.2: Rate-limit utility

**Files:**
- Create: `src/lib/ratelimit.ts`

- [ ] **Step 1: Install**

```bash
pnpm add @upstash/ratelimit
```

- [ ] **Step 2: Create `src/lib/ratelimit.ts`**

```ts
import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

export const claimWriteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'rl:claim-write',
});

export const claimReadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: 'rl:claim-read',
});

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') ?? 'unknown';
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(security): add Upstash rate-limit utility"
```

### Task 14b.3: Apply rate limit to claim endpoints

**Files:**
- Modify: `src/app/api/claim/[productId]/route.ts`
- Modify: `src/app/api/claims/route.ts`

- [ ] **Step 1: Update `src/app/api/claim/[productId]/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { products } from '@/data/products';
import { claimProduct, isClaimed, unclaimProduct } from '@/lib/claims-server';
import { claimWriteLimiter, getClientIp } from '@/lib/ratelimit';

const validIds = new Set(products.map((p) => p.id));

function validate(id: string) {
  if (!validIds.has(id)) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 404 });
  }
  return null;
}

async function gate(req: Request) {
  const ip = getClientIp(req);
  const { success, reset } = await claimWriteLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Moc rychlé! Zkus to znovu za chvilku.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) },
      },
    );
  }
  return null;
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const blocked = await gate(req);
  if (blocked) return blocked;

  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  if (await isClaimed(productId)) {
    return NextResponse.json({ error: 'Already claimed' }, { status: 409 });
  }
  const state = await claimProduct(productId);
  return NextResponse.json({ productId, ...state });
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const blocked = await gate(req);
  if (blocked) return blocked;

  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  await unclaimProduct(productId);
  return NextResponse.json({ productId, claimedAt: null });
}
```

- [ ] **Step 2: Update `src/app/api/claims/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { getAllClaims } from '@/lib/claims-server';
import { claimReadLimiter, getClientIp } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const { success } = await claimReadLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'rate-limited' },
      { status: 429 },
    );
  }

  const claims = await getAllClaims();
  return NextResponse.json(claims, {
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    },
  });
}
```

- [ ] **Step 3: Manual smoke test**

```bash
pnpm dev
```

```bash
for i in $(seq 1 15); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3000/api/claim/placeholder-1
done
```

Expected: first ~10 return `200`/`409`, then `429`. Reset:

```bash
curl -X DELETE http://localhost:3000/api/claim/placeholder-1
```

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(security): apply rate limits to claim API"
```

### Task 14b.4: Vercel BotID on claim write endpoints

**Files:**
- Modify: `src/app/api/claim/[productId]/route.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install BotID SDK**

```bash
pnpm add botid
```

- [ ] **Step 2: Add a server-side check**

Update the top of `src/app/api/claim/[productId]/route.ts`:

```ts
import { checkBotId } from 'botid/server';

// inside both POST and DELETE, BEFORE gate(req):
const bot = await checkBotId();
if (bot.isBot) {
  return NextResponse.json({ error: 'forbidden' }, { status: 403 });
}
```

- [ ] **Step 3: Add the client wrapper to root layout**

In `src/app/layout.tsx`, add `<BotIdClient />` inside `<body>`:

```tsx
import { BotIdClient } from 'botid/client';

// inside body:
<BotIdClient
  protect={[
    { path: '/api/claim/*', method: 'POST' },
    { path: '/api/claim/*', method: 'DELETE' },
  ]}
/>
```

- [ ] **Step 4: Verify dev still works**

```bash
pnpm dev
```

Claim/unclaim should still succeed in normal browser flow. Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(security): add Vercel BotID protection on claim writes"
```

### Task 14b.5: `robots.txt` — disallow indexing

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
```

- [ ] **Step 2: Verify**

```bash
pnpm dev
curl -s http://localhost:3000/robots.txt
```

Expected:

```
User-Agent: *
Disallow: /
```

Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(security): block search-engine indexing via robots.txt"
```

### Task 14b.6: Dependabot

**Files:**
- Create: `.github/dependabot.yml`

- [ ] **Step 1: Create `.github/dependabot.yml`**

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
    groups:
      patches:
        update-types: ['patch']
      minors:
        update-types: ['minor']
  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'monthly'
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: add Dependabot config for npm + actions"
```

### Task 14b.7: Sanity re-run

- [ ] **Step 1: Lint + test + build**

```bash
pnpm lint
pnpm test
pnpm build
```

All must pass.

- [ ] **Step 2: Commit any fixes**

```bash
git add -A && git commit -m "fix: security pass adjustments" || echo "nothing to commit"
```

---

## Phase 15 — Final Local QA

### Task 15.1: Run all checks

- [ ] **Step 1: Lint, type check, tests, build**

```bash
pnpm lint
pnpm test
pnpm build
```

All must pass.

- [ ] **Step 2: Smoke test in dev**

```bash
pnpm dev
```

Manual checklist:
- [ ] Header shows logo + mode switcher + theme toggle
- [ ] Theme toggle flips light/dark without flash
- [ ] Mode override changes hero copy, background effect, accent colour
- [ ] Filter pills change visible products
- [ ] "Skrýt zamluvené" hides claimed cards
- [ ] Click a card → modal opens with image, name, price, description
- [ ] ESC / outside-click closes modal
- [ ] Claim button → card greys, badge appears, button changes to "Uvolnit"
- [ ] Unclaim → confirm dialog → card returns to normal
- [ ] Mobile width: modal becomes bottom sheet, layout becomes single column
- [ ] No console errors
- [ ] `curl -sI` shows CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options headers
- [ ] Hitting `POST /api/claim/placeholder-1` 15× in a row returns ≥1 `429` (rate-limit works)
- [ ] `curl /robots.txt` returns `Disallow: /`

Stop dev server.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix: QA pass adjustments" || echo "nothing to commit"
```

---

## Phase 16 — Deployment + Domain

### Task 16.1: Push to GitHub (user does this)

User pushes the local commits to GitHub from their Mac:

```bash
git push -u origin main
```

If the remote has divergent history, user resolves on their side.

### Task 16.2: First production deploy (user does this)

User runs from their Mac:

```bash
vercel
vercel --prod
```

### Task 16.3: Attach custom domain `dareckyprodominika.cz`

- [ ] **Step 1: Add domain in Vercel (user)**

```bash
vercel domains add dareckyprodominika.cz
```

Vercel prints required DNS records.

- [ ] **Step 2: Configure DNS at IglooNet**

Log into IglooNet admin → DNS zóna pro `dareckyprodominika.cz` → add **exactly** the records Vercel prints (don't hardcode IPs from this plan). Save and wait ~10 minutes for propagation.

- [ ] **Step 3: Verify**

```bash
vercel domains inspect dareckyprodominika.cz
```

Wait for SSL cert provisioning. Open `https://dareckyprodominika.cz` — should load.

---

## Definition of Done

- All Phase 0–16 tasks checked off.
- `pnpm lint && pnpm test && pnpm build` all green.
- Production site loads at `https://dareckyprodominika.cz`.
- Manual smoke test (Phase 15 checklist) all green on both desktop and mobile.
- Lighthouse mobile Perf ≥ 90 (target 95 — adjust images if needed).
- Real product data replaces placeholders before sharing the URL with family.

---

## Out of Scope (deferred per spec)

- Surprise mode for owner (API designed to add later via response filtering).
- Multiple images per product (data structure already supports it).
- Admin UI / CMS — products edited in `products.ts` by assistant.
- Email contact form, analytics, i18n.
