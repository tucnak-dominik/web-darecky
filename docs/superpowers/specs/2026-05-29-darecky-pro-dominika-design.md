# Dárečky pro Dominika — Design Specification

**Date:** 2026-05-29
**Author:** Dominik (owner) & Claude (assistant)
**Status:** Draft for review
**Domain:** `dareckyprodominika.cz` (registered at IglooNet)

---

## 1. Purpose & Audience

A one-page personal gift gallery showcasing items the owner (Dominik) would appreciate as gifts. Aimed primarily at family members (parents, grandparents, siblings) who want inspiration for gifts on birthdays, name days, and Christmas.

**Tone:** Playful, warm, family-friendly. Not corporate. Includes humour in copy, micro-interactions, and seasonal theming.

**Primary use case:** Family member opens the site → browses available gift ideas → optionally reserves one to prevent duplicates → clicks through to retailer to buy.

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16 (App Router, Cache Components)** | Static rendering of product grid via RSC = zero JS overhead for static content. Client JS only for interactive parts (modal, filters, mode switcher, claim toggle). Excellent Vercel integration. |
| Language | **TypeScript** (strict) | Type safety for product data, claim API, mode logic. |
| Styling | **Tailwind CSS v4** | Fast iteration, small bundle, pairs well with shadcn/ui. |
| UI components | **shadcn/ui** (Dialog, Button, Badge, Card, Switch) | Copy-paste, fully customizable, no npm bloat. |
| Animations | **Motion (Framer Motion)** | Modal transitions, card hover, filter animations, mode-change transitions. |
| Seasonal effects | **canvas-confetti** + custom CSS animations (snow, sparkles) | Lightweight, no heavy libraries. |
| Icons | **Lucide React** | Consistent, lightweight, modern set. |
| Fonts | **Geist Sans + Geist Mono** via `next/font` | Modern, optimized for Vercel, mono for prices. |
| Theme | **next-themes** | Light/dark, persistence, no FOUC. |
| Data store (products) | **`src/data/products.ts`** | TypeScript file with typed array, edited via Claude Code. |
| Data store (reservations) | **Upstash Redis** (via Vercel Marketplace) | Shared state across visitors. Free tier (10k commands/day) — vastly exceeds expected usage. |
| Linting / formatting | **Biome** | Faster than ESLint+Prettier, single tool, single config. |
| Package manager | **pnpm** | Fast, disk-efficient. |

### 2.1 Hosting

- **Vercel** (Hobby tier — free, indefinitely).
- Custom domain `dareckyprodominika.cz` connected via DNS A/CNAME records at IglooNet.
- Automatic HTTPS via Let's Encrypt (Vercel-managed).

---

## 3. Information Architecture

Single-page layout, scroll-based, no routing to separate pages. Sections from top to bottom:

1. **Header** (sticky)
   - Logo / site name: *"🎁 Dárečky pro Dominika"*
   - Active seasonal mode indicator (emoji + label)
   - Mode override dropdown (testing only — to be removed/hidden post-launch)
   - Dark / light mode toggle
2. **Hero**
   - Mode-specific greeting (large H1)
   - Mode-specific subtitle
3. **Filter bar**
   - Pills: `[Vše]` + 4 price categories
   - Toggle: `[☑ Skrýt zamluvené]`
4. **Product grid**
   - Responsive 1/2/3/4 columns
   - Each card shows: image, name, price, category badge, reservation indicator (if claimed)
5. **Footer**
   - Short signature line (e.g. *"Made with ❤️ by Dominik"*)
   - Optional contact link

### 3.1 Product Detail Modal (Popup)

Triggered by clicking a product card.

- **Desktop:** centered modal overlay, ~640 px wide.
- **Mobile:** bottom sheet (slides up, swipeable to dismiss).
- Content:
  - Large product image (single image v1; data structure prepared for multiple images later)
  - Name (H2)
  - Price (large, prominent, mono font)
  - Category badge
  - Long description (paragraph, can include humor)
  - Reservation status & toggle button
  - Primary CTA: **"🛒 Koupit u prodejce"** → opens external link in new tab
  - Close button (X) + click outside / ESC dismiss

---

## 4. Product Data Model

```ts
// src/data/products.ts
export type PriceCategory = 'small' | 'medium' | 'large' | 'premium';

export type Product = {
  id: string;             // stable slug, e.g. "kniha-sapiens"
  name: string;
  description: string;    // markdown-light, may contain newlines
  price: number;          // CZK, integer
  category: PriceCategory;
  images: string[];       // array of paths (public/products/...) — single image v1
  buyUrl: string;         // external retailer URL
  addedAt: string;        // ISO date, for sorting "newest first"
};

export const products: Product[] = [/* ... */];
```

### 4.1 Price Categories

| Key | Label | Range (CZK) | Accent colour (light/dark) |
|---|---|---|---|
| `small` | 🍬 Drobnost | < 500 | mint green |
| `medium` | 🎁 Hezký dárek | 500 – 1 999 | coral orange |
| `large` | 🎀 Větší radost | 2 000 – 4 999 | lavender |
| `premium` | ✨ Splněné přání | ≥ 5 000 | gold / deep purple |

Category accent is applied to: filter pill (when active), card price badge, modal accent line.

**Note:** the category is stored explicitly on the product (`category` field). Price ranges above are the editorial guideline — the category is not derived from price at runtime, giving room for manual overrides if needed.

### 4.2 Default Product Sort

Products are sorted by `addedAt` **descending** (newest first) in the rendered grid. No user-facing sort controls in v1.

---

## 5. Seasonal Modes

### 5.1 Mode Definitions

| Mode | Active window | Accent palette | Background effect | Hero copy |
|---|---|---|---|---|
| 🎂 Narozeniny | 5.8. → 9.11. | pastel pink + turquoise | animated confetti in hero | *"Dominik má narozky! 🎂 Tady je inspirace..."* / *"...na to, co by mu udělalo radost"* |
| 🎉 Svátek | 25.12. → 4.8. | warm gold + coral | shimmering sparkles in hero | *"Dominik má svátek! 🎉"* / *"Tradice je tradice — drobnost potěší."* |
| 🎄 Vánoce | 10.11. → 24.12. | muted red + green + cream | falling snowflakes (page-wide) | *"Ho ho ho! 🎄 Vánoce klepou na dveře"* / *"Ať se ti tipy hodí pod stromeček."* |

**Owner's dates:** birthday **9.11.**, name day **4.8.** (Dominik), Christmas **24.12.**.

### 5.2 Mode-switching Logic

- The active mode is the one whose date is **next upcoming or today**.
- The mode switches **the day after** an event date passes.
- Always exactly one mode is active (the cycle covers the full year).
- Determination: server-side at render time (using Europe/Prague timezone).
- Mode is set as a CSS class on `<html>` (e.g. `mode-birthday`, `mode-nameday`, `mode-christmas`) for styling.

### 5.3 Manual Override (testing only)

- Header dropdown: `[Auto ▾]` with options: `Auto (dle data)` / `🎂 Narozeniny` / `🎉 Svátek` / `🎄 Vánoce`.
- Persisted in `localStorage` under `mode-override`.
- When override is set, client adjusts CSS class on hydration (brief possible flash — acceptable for testing purposes).
- **Removal plan:** post-launch, the dropdown will be hidden behind a feature flag or removed. The underlying logic stays so it can be re-enabled if needed.

### 5.4 Per-mode visual elements

Each mode varies:
- Accent colour CSS variables (drive buttons, badges, links)
- Background effect (confetti / sparkles / snowflakes) rendered as fixed-position decorative layer
- Hero H1 + subtitle
- Header decoration (small balloons / flowers / garland)
- One micro-interaction on click (confetti burst / sparkle flash / snow scatter)

---

## 6. Reservation System ("Zamluveno")

Anonymous, trust-based gift claiming so family members don't accidentally buy the same item.

### 6.1 Model

- **Binary state per product:** `claimed` or `available`.
- **No identity** — no nicknames, no logins, no per-device tracking.
- **Anyone can claim** any available product.
- **Anyone can unclaim** any claimed product (a confirmation prompt prevents accidental clicks).

### 6.2 Data Storage

- Upstash Redis key: `claim:<product-id>`
- Value: `{ claimedAt: ISO-string }` or absent (= available)
- Set on claim, deleted on unclaim.

### 6.3 API

| Endpoint | Method | Behaviour |
|---|---|---|
| `/api/claims` | GET | Returns `{ [productId]: { claimedAt } }` for all claimed products. Cached briefly (e.g. 10s) to reduce Redis hits. |
| `/api/claim/[productId]` | POST | Creates claim if product not already claimed. Returns updated state. |
| `/api/claim/[productId]` | DELETE | Removes claim. Returns updated state. |

- All endpoints anonymous (no auth).
- Validation: `productId` must exist in product data (server checks against imported product list).

### 6.4 UX

**Available card:**
- Normal appearance.
- Bottom-right: small button `☐ Zamluvit pro Dominika`.

**Claimed card:**
- Opacity ~60 %.
- Top-right corner badge: `💝 Zamluveno`.
- Bottom-right button changes to: `↩ Uvolnit rezervaci`.
- Click triggers confirmation dialog: *"Opravdu uvolnit? Pokud tu věc nekupuješ ty, někdo jiný ji možná už shání."* `[Ano, uvolnit] [Zrušit]`.

**Filter toggle:**
- `[☑ Skrýt zamluvené]` in filter bar — hides claimed cards.

**Real-time-ish updates:**
- On page load: fetch all claims.
- On focus / tab return: re-fetch (so family members don't accidentally double-claim if another person just claimed something).
- After own action: optimistic update + revalidation.

### 6.5 Future: Surprise Mode (NOT in v1)

A "Jsem Dominik" toggle that hides reservation state from the owner so surprises stay surprises. **Deferred.** API will be designed so this can be added without backend changes (e.g. via a client-side filter or a request header that omits claims from the response).

---

## 7. Visual Design

### 7.1 Typography

- **Headings:** `Geist Sans` semibold/bold, generous size (H1 ~48 px desktop / ~32 px mobile)
- **Body:** `Geist Sans` regular, 16 px base, 1.6 line-height
- **Prices & technical accents:** `Geist Mono` regular
- Loaded via `next/font` with `display: swap`

### 7.2 Colour System

- Two themes: **light** (default, respects system) + **dark**.
- Base palette: neutral grays + warm white background (light) / near-black background (dark).
- **Accent colours are mode-driven** (set as CSS variables, swapped when mode changes).
- **Category colours** are static within a theme (mint/coral/lavender/gold).

### 7.3 Card Design

- Rounded corners (12 px).
- Subtle shadow (lighter in light mode, soft glow in dark mode).
- Hover: slight scale (1.02), shadow intensifies, image gets gentle zoom.
- Image fills top portion, content below with padding.
- Category badge top-left, claim badge (if any) top-right.

### 7.4 Animations

- All transitions use Motion / CSS `prefers-reduced-motion` respected.
- Modal: fade + scale (200 ms).
- Filter change: animated grid (FLIP-style via Motion `layout` or CSS View Transitions).
- Background effects loop infinitely but throttle when tab inactive.
- Reduced-motion users: static fallbacks (no confetti / snow / sparkles).

---

## 8. Responsiveness

| Breakpoint | Width | Grid columns | Hero | Modal |
|---|---|---|---|---|
| Mobile | < 640 px | 1 | compact, smaller text | bottom sheet (swipe down to close) |
| Tablet | 640 – 1024 px | 2 | medium | centered modal |
| Laptop | 1024 – 1280 px | 3 | full | centered modal |
| Desktop | > 1280 px | 4 | full + side spacing | centered modal |

- **Mobile-first** Tailwind approach.
- Touch targets minimum 44×44 px.
- Bottom-sheet modal on mobile via Motion drag-to-dismiss + backdrop tap.

---

## 9. Performance & SEO

- Static rendering of product grid (RSC) — no JS to display content.
- Next.js `<Image>` for all product images (WebP/AVIF, responsive srcset, lazy-loaded).
- Open Graph meta tags (title, description, preview image) for nice link previews in Messenger / WhatsApp / Signal.
- `manifest.json` + apple-touch-icon for "Add to Home Screen".
- Favicon (initial: 🎁 emoji as SVG favicon).
- Target Lighthouse mobile scores: Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO ≥ 95.

---

## 10. Accessibility

- Semantic HTML (`<header>`, `<main>`, `<footer>`, `<article>` per card, `<dialog>` for modal).
- Keyboard navigation: tab order respects visual order, ESC closes modal, focus returns to trigger.
- Visible focus rings (custom, mode-coloured).
- ARIA labels on icon-only buttons.
- Colour contrast WCAG AA in both themes.
- `prefers-reduced-motion` disables decorative animations and background effects.
- All images have `alt` text (taken from product `name` or override field).

---

## 11. Security & Hardening

The site is publicly reachable (no auth) and the reservation API is anonymous, so the main risks are spam / abuse of the claim endpoints, generic bot traffic, and standard web hardening.

### 11.1 Default protections (no extra work)

- HTTPS auto-provisioned by Vercel (Let's Encrypt).
- React escapes all dynamic content in JSX (no XSS via product names or descriptions).
- External "buy" links use `target="_blank" rel="noopener noreferrer"` (no tabnabbing).
- No SQL → no SQL injection. Redis is accessed via the typed Upstash SDK.
- API routes validate `productId` against the static product list (`validIds`); unknown IDs return 404.
- No PII collected; no accounts; localStorage holds only UI preferences (`mode-override`, theme).
- Secrets stored in `.env.local` (gitignored) and Vercel env vars.

### 11.2 Required additions in v1

#### a) Rate limiting on `/api/claim/*`

- Library: `@upstash/ratelimit` (shares the existing Redis instance, no extra cost).
- Strategy: sliding-window, **10 requests per minute per IP** (sum of POST + DELETE across all product IDs).
- Source IP read from `x-forwarded-for` (Vercel sets it).
- On limit exceeded: respond `429 Too Many Requests` with a friendly Czech message.
- The `GET /api/claims` endpoint has its own much higher limit (e.g. 60 req/min/IP) — it's cheap and used for polling.

#### b) Vercel BotID on `/api/claim/*`

- Vercel BotID (GA since June 2025) — free on Hobby.
- Wrapped via the `botid` SDK on the POST and DELETE handlers.
- Bots get a 403; humans pass through.
- Combined with rate limiting, this stops the "script claims everything in 10 seconds" attack.

#### c) Security headers in `next.config.ts`

Headers applied to **all** routes:

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; font-src 'self' data:; connect-src 'self' https://*.upstash.io; frame-ancestors 'none'` | XSS mitigation, clickjacking |
| `X-Frame-Options` | `DENY` | Defence in depth vs clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Don't leak full URLs to retailers |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused capabilities |
| `X-Content-Type-Options` | `nosniff` | Disable MIME sniffing |

Note: CSP allows inline styles/scripts because Next.js / Tailwind / shadcn use them. A stricter nonce-based CSP can come later.

#### d) `robots.txt` — disallow indexing

- A wishlist for family doesn't belong in Google.
- `src/app/robots.ts` returns `User-agent: *` / `Disallow: /`.
- This is a soft signal — anyone with the URL still reaches the site.

#### e) GitHub Dependabot

- `.github/dependabot.yml` configured to open weekly PRs for npm + GitHub Actions updates.
- Lightweight; no auto-merge.

### 11.3 Operational practices

- `pnpm audit` (run locally before any major upgrade).
- Lockfile (`pnpm-lock.yaml`) committed.
- Vercel deployment logs + Vercel Firewall dashboard checked occasionally (especially after sharing the URL with family — to spot abuse early).

### 11.4 Explicit non-features

- **No password gate / family-only auth.** The expected sharing path is "send a link to relatives"; an extra password gate would friction onboarding for grandparents. The combination of `robots.txt` + rate limiting + BotID is enough deterrence for a personal site.
- **No CSRF tokens.** There is no per-user authenticated state; the claim endpoint behaves identically whether called via the site or via curl from another origin, so CSRF doesn't expand the attack surface.

---

## 12. Folder Structure (proposed)

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # root layout, fonts, theme provider, mode resolver
│   │   ├── page.tsx             # single page composing all sections
│   │   ├── globals.css          # Tailwind + CSS vars (themes + mode accents)
│   │   └── api/
│   │       ├── claims/route.ts          # GET all
│   │       └── claim/[productId]/route.ts # POST / DELETE
│   ├── components/
│   │   ├── header.tsx
│   │   ├── hero.tsx
│   │   ├── filter-bar.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-card.tsx
│   │   ├── product-modal.tsx
│   │   ├── claim-button.tsx
│   │   ├── mode-switcher.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── effects/
│   │   │   ├── confetti-background.tsx
│   │   │   ├── sparkles-background.tsx
│   │   │   └── snow-background.tsx
│   │   └── ui/                  # shadcn/ui generated components
│   ├── data/
│   │   └── products.ts
│   ├── lib/
│   │   ├── mode.ts              # mode resolution logic + dates
│   │   ├── redis.ts             # Upstash client
│   │   ├── claims.ts            # server actions / helpers for claim state
│   │   └── utils.ts             # cn(), formatters
│   └── types/
│       └── product.ts
├── public/
│   ├── products/                # product images
│   └── favicon.svg
├── docs/superpowers/specs/      # this document
├── biome.json
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts           # if needed for v4
├── tsconfig.json
└── README.md
```

---

## 13. Deployment Plan

1. **Initialize repo** (Next.js 16 + Tailwind + TS + Biome) — `pnpm create next-app`.
2. **Initialize shadcn/ui**.
3. **Install Upstash Redis integration** via Vercel Marketplace → injects env vars automatically.
4. **Build the app** locally, iterate.
5. **Deploy to Vercel** — automatic preview deployments on every commit.
6. **Connect custom domain** `dareckyprodominika.cz`:
   - In Vercel project → Domains → Add `dareckyprodominika.cz`.
   - Copy A / CNAME records into IglooNet DNS admin.
   - Wait for propagation (~10 min – few hours).
   - Vercel auto-provisions SSL.
7. **Smoke test** — open the live URL on mobile and desktop, claim a product, switch modes.

---

## 14. Out of Scope (v1)

- User identity / nicknames.
- Surprise mode for owner.
- Multiple images per product (data structure ready; UI to be added later).
- CMS / admin UI (products edited in `products.ts`).
- Analytics (can be added later — Vercel Analytics is one-click).
- Email contact form.
- Internationalization (Czech only).
- PWA offline capability beyond manifest.

---

## 15. Success Criteria

- Site loads in under 1.5 s on a mid-range mobile on 4G (mobile Lighthouse Perf ≥ 95).
- Family members (non-technical) can browse, open a product detail, and click through to retailer with zero confusion.
- A claim made on one device is visible to all other devices within seconds (after tab focus / refresh).
- Site visually adapts to the current seasonal mode automatically without manual intervention.
- Manual mode override and dark/light toggle work without page reload.
- Site is fully usable on screens from 320 px up to ultra-wide.
