# Project: Dárečky pro Dominika

One-page rodinný gift wishlist (`dareckyprodominika.cz`). Cílovka: rodina, aby se nestalo, že Dominika dostane stejný dárek dvakrát.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Cache Components) + TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Fonts:** Geist Sans + Geist Mono (via `next/font`)
- **State**
  - Products: `src/data/products.ts` (typed TS array, edited via Claude Code)
  - Claims: Upstash Redis (via Vercel Marketplace) + `/api/claim/*` routes
- **Effects:** canvas-confetti + CSS-only snow/sparkles (žádný Motion v v1)
- **Theming:** next-themes (light/dark, system default)
- **Lint/Format:** Biome (žádný Prettier ani ESLint)
- **Testing:** Vitest + React Testing Library
- **Package manager:** pnpm

## Hosting
- **Vercel** Hobby tier (free), `vercel` CLI flow
- **Doména:** `dareckyprodominika.cz` (zaregistrovaná u IglooNet, čeká na napojení DNS)
- **Žádný email hosting, žádný extra SSL** (Vercel vystaví automaticky)

## Spec & Plan — single source of truth
- Spec: `docs/superpowers/specs/2026-05-29-darecky-pro-dominika-design.md`
- Plan: `docs/superpowers/plans/2026-05-29-darecky-pro-dominika.md`

Pokud měníme scope: **nejdřív update spec, pak plán, pak kód.** Nikdy nesmí být tyto dokumenty v rozporu s implementací.

## Git
- **Remote:** `origin` = `https://github.com/tucnak-dominik/web-darecky.git`
- **Default branch:** `main`
- **Split:** Claude dělá **jen lokální commity** (`git add` + `git commit`). **Push dělá uživatel ručně ze svého Macu** — Claude sandbox není autentizovaný proti GitHubu. Nikdy nespouštět `git push` / `git pull` / žádnou remote-affecting operaci. Pokud plán říká "push", uživatel to udělá sám.

## Seasonal modes (autoritativní data)
| Mode | Datum | Aktivní okno |
|---|---|---|
| 🎂 Narozeniny | 9.11. | 5.8. → 9.11. |
| 🎉 Svátek (Dominik) | 4.8. | 25.12. → 4.8. |
| 🎄 Vánoce | 24.12. | 10.11. → 24.12. |

Logika v `src/lib/mode.ts`. Pokud se data mění, updatuj **spec + plán + tento soubor + `src/lib/mode.ts`** najednou.

## Workflow defaults pro tento projekt
- **TDD** pro čistou logiku (`src/lib/*.ts`, API routes). UI komponenty verifikuju v prohlížeči (`pnpm dev` + manuální klik) nebo přes Chrome DevTools MCP, ne přes RTL.
- **Security** — viz spec §11. Rate-limit, BotID, CSP a robots.txt jsou **povinné** před produkčním nasazením, ne nice-to-have.
- **Komentáře v kódu:** anglicky (per globální pravidla). Komunikace s uživatelem: česky.
- **Reservation system:** anonymní, binární, trust-based. Žádná identita, žádné nicknames.

## Future / odložené (nepokoušet se přidat bez explicitní žádosti)
- Surprise mode pro Dominika (API to už architektonicky umí)
- Více obrázků na produkt (datový model `images: string[]` to umí)
- Manual mode override dropdown bude po fázi testování skryt
