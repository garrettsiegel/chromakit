# Astro Migration Plan

Migrate the demo/docs site (`client/`) from a Vite + React SPA to **Astro with static output and React islands**. The npm library (`client/src/lib/color-picker/`) is untouched — only the site around it changes.

**Why:** The site is a content-heavy docs/marketing site with pockets of interactivity — exactly Astro's model. Today every page ships a ~360 KB JS bundle and serves an empty `<div id="root">` to crawlers; the rich meta/OG/JSON-LD in `index.html` is identical on every route. After migration: real HTML per page, unique per-page titles/descriptions/canonicals, and JS only for the live picker demos.

## How to use this file

Work top to bottom, one phase at a time. Each phase names the model to run it with — **the user switches models between phases** (`/model`). Check off tasks as they complete. Do not start a phase until the previous phase's **Gate** passes. Work happens on the `astro-migration` branch — **never push to `main`** (pushing `main` auto-deploys to Vercel).

| Phase | Model | Theme | Size |
|---|---|---|---|
| 1 | **Opus** | Foundation: scaffold, config surgery, reference page | L |
| 2 | **Sonnet** | Mechanical porting: remaining pages + cleanup | M |
| 3 | **Opus** | SEO, hardening, pipeline verification | M |
| 4 | **Sonnet** | Docs housekeeping + PR | S |

## Invariants — read before every phase

- **Never modify `client/src/lib/color-picker/`** — it is the published npm package. The React demo components importing it keep working as islands.
- **Zero runtime deps**: everything new goes in `devDependencies`. `dependencies` must stay absent.
- **npm, not pnpm.** Repo rules: no `eslint-disable` comments ever, files ≤ 300 lines, no `any`, `@/` alias not deep relative imports.
- These must pass unchanged after every phase: `npm run verify`, `npm run test:ci`, `npm run build` (library — vitest.config.ts is standalone; the lib build in vite.config.ts must keep producing byte-identical output).
- **Known quirk to preserve:** `build:lib` has `emptyOutDir: true` on `dist/` — it deletes the site output (`dist/public`) whenever the library builds. This is load-bearing: it's why site files never reach the npm tarball (`files: ["dist"]`). Keep Astro's `outDir` at `dist/public` and do not remove that wipe.

## Target architecture (decided — don't relitigate)

- `astro.config.mjs` at root: `srcDir: 'client/src'`, `publicDir: 'client/public'`, `outDir: 'dist/public'`, `site: 'https://www.chromakit.site'`, integrations `react()` + `sitemap()`, `vite: { plugins: [tailwindcss()], define: { __PKG_VERSION__ } }`, `redirects: { '/docs': '/docs/getting-started' }`.
- Pages: `client/src/pages/index.astro`, `404.astro`, `docs/<slug>.astro` (7 files, replacing the wouter `/docs/:slug` route).
- Static chrome becomes `.astro`: layouts, header/footer, sidebar, `DocSection`, `PropsTable`, static code blocks (Astro's built-in `<Code>` — shiki at build time, zero client JS; theme `one-dark-pro` to match the current prism `oneDark`).
- Interactive pieces stay React, hydrated as islands with `client:visible`: `DemoPlayground`, `CustomPickerDemo`, `ColorFormatsDisplay`, `DemoCard` (keeps prism-react-renderer internally for its Code tab), and the small per-page demos.
- The `pages/docs/data/*.ts` reference-data files are kept as-is and imported by `.astro` pages.

---

## Phase 1 — Opus — Foundation & reference implementation ✅ COMPLETE

- [x] **T1. Branch.** On `astro-migration` (off `main`).
- [x] **T2. Install.** Astro 7 core installed. **NOTE:** `eslint-plugin-astro` latest (2.x) requires eslint ≥10; this repo is on eslint 9, so it's pinned to **`^1.7.0`** (newest 1.x, supports eslint ≥8.57). `dependencies` confirmed absent — all new packages are devDependencies.
- [x] **T3. `astro.config.mjs`** created: `srcDir: ./client/src`, `publicDir: ./client/public`, `outDir: ./dist/public`, react()+sitemap(), tailwindcss() vite plugin, `__PKG_VERSION__` define, `redirects: { '/docs': '/docs/getting-started' }`, `@` alias.
- [x] **T4. Slimmed `vite.config.ts` to library-only** (no mode branching). `npm run build` verified **byte-identical** (es 11.39 kB / umd 9.91 kB / css 3.11 kB gzip). vitest.config.ts untouched (confirmed standalone).
- [x] **T5. tsconfig / env.** Added `client/src/env.d.ts` (`/// <reference types="astro/client" />`) instead of extending astro base (keeps tsc green without needing `astro sync` first). `@/` alias works in both. `check:astro` script added and appended to `verify`.
- [x] **T6. ESLint.** Added `...astro.configs['flat/recommended']` + an `*.astro` block registering `__PKG_VERSION__` global and re-applying `eslint-comments/no-use`. `.astro/` and `.stats/` added to eslint `ignores` (they contain generated code).
- [x] **T7. `BaseLayout.astro`** — full head ported (GA, theme no-flash script, OG/canonical from `Astro.url`, fonts, JSON-LD gated behind `jsonLd` prop). Imports `@/index.css`.
- [x] **T8. `ThemeToggle.astro`** — inline SVGs (moon/sun via `dark:` classes) + tiny toggle script, zero hydration.
- [x] **T9. `SiteHeader.astro` / `SiteFooter.astro`** — ported as plain HTML (Badge/Button classes inlined from ui/*), links are plain `<a>`.
- [x] **T10. `index.astro`** — Hero `client:load`, DemoPlayground/Usage/FinalCTA `client:visible`, FeaturesSection static (no directive → SSR HTML). All still React islands; Phase 2 converts the static ones.
- [x] **T11. Docs reference implementation** — `layouts/DocsLayout.astro`, `pages/docs/_nav.ts`, `components/docs/DocSection.astro` + `PropsTable.astro` + `StaticCode.astro`, `components/demos/BasicDemo.tsx` + `BasicDemoCard.tsx`, `pages/docs/getting-started.astro`. All built and rendering static HTML with shiki code + per-page SEO.
- [x] **T12. Scripts** updated (`dev`/`build:site`/`preview` → astro).
- [x] **T13. GATE 1 PASSED.** `verify` 0 errors/0 warnings; `test:ci` 239 passed; `build` lib byte-identical; `build:site` OK. Dev server: `/` + `/docs/getting-started` serve real HTML with islands, `/docs`→301, unknown docs slug→404. **Visual click-through NOT run** (Chrome extension not connected) — islands are wired (hydration markers present) but interactivity is unverified by eye; verify in a browser during Phase 2/3.

### ⚠️ Phase 1 → Phase 2 handoff notes (READ FIRST, Sonnet)

Some things deviated from the original plan to make old React + new Astro coexist. Current reality:

1. **Reference data moved to `client/src/site-data/`** (was `pages/docs/data/`). Import via `@/site-data/<file>` (e.g. `@/site-data/color-picker-props`). Reason: `.ts` files under `pages/` become Astro endpoints. This is their **permanent** home.
2. **Old React content doc pages live in `client/src/_legacy-docs/`** — `GettingStartedDoc.tsx`, `ColorPickerDoc.tsx`, `ComponentsDoc.tsx`, `HooksDoc.tsx`, `UtilitiesDoc.tsx`, `ThemingDoc.tsx`, `TroubleshootingDoc.tsx`. **Port each `.astro` page FROM these**, then delete the whole `_legacy-docs/` folder in T23.
3. **Routing glue already deleted in Phase 1** (so T23 is smaller): `main.tsx`, `App.tsx`, `components/ErrorBoundary.tsx`, `pages/Home.tsx`, `pages/docs/DocsPage.tsx`, `pages/docs/DocsSidebar.tsx`, `pages/docs/_docs-nav.ts` are **gone**. Still to delete in T23: `_legacy-docs/`, `client/index.html`, orphaned React chrome (`components/layout/SiteHeader.tsx` + `SiteFooter.tsx`, `components/ThemeToggle.tsx`) — confirm nothing imports them — and `npm uninstall wouter`.
4. **Live-demo island pattern (IMPORTANT).** Astro renders framework-component children as *static* slots, so a live demo passed as a child of a React island does NOT hydrate. Each live demo needs a **single React wrapper** that composes `DemoCard` + the demo *inside* React, mounted once with `client:visible`. See `components/demos/BasicDemoCard.tsx` as the template. Create one per demo (`PresetDemoCard`, `FormatDemoCard`, `HookDemoCard`, `ConverterDemoCard`, `ThemedDemoCard`, plus reuse `CustomPickerDemo`), each importing its code string from `@/site-data/*` where available.
5. **`StaticCode.astro`** uses Astro `<Code theme="one-dark-pro">`; its `lang` prop is a union `'tsx' | 'typescript' | 'bash' | 'css'` — extend the union if a page needs another language.
6. **`DocSection.astro`** takes `description` as a **string**. `TroubleshootingDoc` uses JSX (rich) descriptions — render those as page markup (a `<p>` before the section, or add a `set:html`/slot to DocSection) rather than passing JSX.
7. **`PropsTable.astro`** reuses the `PropRow` type from `components/docs/PropsTable.tsx`; all data-file descriptions are plain strings (safe to render in Astro).
8. **`vercel.json` still has the SPA rewrite** — leave it; Phase 3 (T27) fixes it.

## Phase 2 — Sonnet — Mechanical porting ✅ COMPLETE

- [x] **T14. Home sections to `.astro`.** `HeroSection.astro`, `FeaturesSection.astro`, `FinalCTA.astro` converted. **Icons rendered via `lucide-react` React components with NO client directive** (Astro SSRs framework components to static HTML and ships zero JS when there's no `client:*` — used this instead of hand-drawing SVG paths, so icons are pixel-identical to the original). `UsageSection.astro` uses `StaticCode.astro`; "full documentation →" already pointed at `/docs` from Phase-1-era work. `FinalCTA`'s "Read Full Documentation" button now also points to `/docs` instead of npm (was inconsistent with UsageSection before — a small fix, not scope creep).
- [x] **T15. Demo-card islands created** in `components/demos/`: `ControlledDemoCard`, `PresetDemoCard`, `FormatDemoCard` (color-picker), `BuildYourOwnDemoCard` (components), `HookDemoCard` (hooks), `ConverterDemoCard` (utilities), `ThemedDemoCard` (theming). Also `InstallCommandBox.tsx` — a small shared island (variant prop) for the two copy-install-command widgets in Hero/FinalCTA, reusing the existing `CopyButton` (avoided duplicating clipboard logic).
- [x] **T16-T21. All 6 remaining docs pages built** and verified rendering real static HTML with correct data: `color-picker.astro`, `components.astro`, `hooks.astro`, `utilities.astro`, `theming.astro`, `troubleshooting.astro` (4 explicit `DocSection`s, not a data-driven loop, since 2 issues have rich inline markup — see handoff note 6).
- [x] **T22. `404.astro`** — BaseLayout + SiteHeader/Footer, links to `/` and `/docs`.
- [x] **T23. Cleanup done:** deleted `client/src/_legacy-docs/` (all 7 files), `client/index.html`, `components/layout/SiteHeader.tsx` + `SiteFooter.tsx`, `components/ThemeToggle.tsx`, and the 4 old React home-section `.tsx` files. `npm uninstall wouter` — confirmed zero remaining `wouter` references in `client/src`. `dependencies` still absent.
- [x] **T24. GATE 2 PASSED.** `verify`: 0 errors/0 warnings (13 informational "hints" only — pre-existing test-file deprecation notices plus a lucide-react package-wide `Github` icon brand-deprecation hint that pre-dates this migration, surfaced now because `astro check` does deeper type checking than plain `tsc`). `test:ci`: 239 passed. `build`: lib byte-identical (es 11.39 kB / umd 9.91 kB / css 3.11 kB gzip). `build:site`: **9 pages** built (8 real + 404). Route verification via `astro preview` + fetch (Chrome extension still not connected, so no visual click-through — see caveat below): all 8 real pages → 200, unknown `/docs/*` slug → real 404, `/docs` → meta-refresh to `/docs/getting-started`, mobile nav + sidebar present on every docs page, islands present on 7/8 docs pages (troubleshooting is correctly island-free — fully static).

### ⚠️ Phase 2 → Phase 3 handoff notes (READ FIRST, Opus)

1. **Visual click-through still not done across 2 phases now.** The Chrome extension has not been connectable in either Phase 1 or Phase 2. Programmatic verification (route status codes, content greps, island-hydration-marker presence, mobile-nav/sidebar markup) strongly suggests everything works, but **no one has clicked a button or dragged a slider in an actual browser yet**. Phase 3 T31 says "Static QA on `astro preview`" — try the Chrome tools again there; if still unavailable, tell the user explicitly that interactivity has never been eyeballed, only inferred from static analysis.
2. **`package.json` `knip` config still lists `client/src/main.tsx`** as an entry point — that file no longer exists (deleted in Phase 1). This is already T29's job; flagging so it's not missed.
3. **`vercel.json` still has the Phase-1-era SPA rewrite** (`"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`) — this is stale now that real files exist for every route (it would have Vercel serve `index.html` for a 404 instead of the real `404.html`). This is T27's job.
4. **Lucide icon pattern established in T14** (static SSR, no client directive) is reusable — if Phase 3 or future work adds more static icons anywhere in `.astro` files, prefer importing the real `lucide-react` component over hand-drawing SVGs.
5. **All 8 docs/home pages now build and are internally consistent** — every page uses `DocsLayout`/`BaseLayout`, every doc page pulls its meta `description` from `DOCS_NAV` in `_nav.ts`, per-page `title` is hardcoded per page as `"<Name> · ChromaKit Docs"` (matches the Phase 1 `getting-started.astro` pattern exactly).

## Phase 3 — Opus — SEO, hardening & pipeline verification ✅ COMPLETE

- [x] **T25. Per-page SEO verified + hardened.** All 8 real pages have unique `<title>`, `description`, and per-page `canonical` (`https://www.chromakit.site/<path>/`). **Fixes made:** og:image default and JSON-LD `url` were non-www (`chromakit.site`) while canonical/og:url are www — unified to **www** for consistency. Added a `noindex` prop to `BaseLayout` and set it on `404.astro` (emits `<meta name="robots" content="noindex, follow">`). View-source confirmed: real content + unique meta on every page.
- [x] **T26. Sitemap + robots.** `@astrojs/sitemap` emits `sitemap-index.xml` + `sitemap-0.xml` listing all 8 real pages (www URLs; no 404 or `/docs` redirect page — correctly excluded). Added `client/public/robots.txt` (allow-all + `Sitemap:` pointing at `sitemap-index.xml`); confirmed copied to `dist/public/robots.txt`.
- [x] **T27. `vercel.json` fixed.** Removed the stale SPA rewrite (it would have served `index.html` for real 404s). Added a server-level redirect `/docs → /docs/getting-started` (`permanent: false`). Astro's generated `dist/public/docs/index.html` meta-refresh remains as the non-Vercel fallback. `outputDirectory` stays `dist/public`.
- [x] **T28. npm tarball audit PASSED.** `npm pack --dry-run`: **34 files**, only `dist/` library artifacts (JS bundles + CSS + `.d.ts`) + README + LICENSE + package.json. **Zero `.astro`/site files** — the `build:lib` `emptyOutDir` wipe still protects the tarball. `npm run size` passes (ES 9.42 / UMD 9.97 / CSS 3.07 kB, all under limit).
- [x] **T29. knip fixed + repo de-crufted.** Updated `knip` entry (removed dead `main.tsx`; added `client/src/pages/**/*.{astro,ts}` + kept lib index) and `project` (added `.astro`). Knip surfaced 3 dead leftovers from the migration, now removed: deleted `components/ui/badge.tsx` + `components/docs/DocSection.tsx` (React versions, replaced by `.astro`), and reduced `components/docs/PropsTable.tsx` → `PropsTable.ts` (type-only — the React `PropsTable` component was dead, but the `PropRow` type is imported by 6 files; extensionless imports resolve to `.ts` so no import edits needed; `.astro` imports use the explicit `.astro` extension so there's no resolution collision). `npx knip` now exits **0, clean**.
- [x] **T30. Full pipeline gate PASSED** (in order): `verify` 0 errors/0 warnings → `test:ci` 239 passed → `build` **lib es 11.39 kB gzip byte-identical to v0.2.3** → `size` under limits → `build:site` 9 pages + robots + sitemap.
- [x] **T31. Static QA on `astro preview` PASSED.** `/docs/utilities` view-source: conversion + helper tables and prose are **real HTML without any JS** (SEO goal proven); shiki `astro-code` present; GA tag (`G-8KHB47TJSP`) present; theme no-flash script present; unique canonical. 404 has `noindex` + real content. Islands confirmed wired: `<astro-island>` elements carry `component-url` → chunks that exist on disk, `client="visible"`/`"load"` directives correct (home: InstallCommandBox load + DemoPlayground visible + InstallCommandBox visible; utilities: ConverterDemoCard visible; troubleshooting: **zero island scripts — fully static ✓**). `/docs` redirects; unknown slug → 404.

### ⚠️ Phase 3 → Phase 4 handoff notes (READ FIRST, Sonnet)

1. **Visual click-through STILL never happened — flag this to the user in the PR.** The Chrome extension has been unconnectable across all THREE phases. Every claim about interactivity (picker drags, theme toggle flips, copy buttons copy, islands hydrate on scroll) is inferred from **static analysis only** — correct island markup, on-disk chunks, hydration directives — never eyeballed in a running browser. This is strong but not conclusive. The Phase 4 PR body (T36) MUST state plainly that interactivity was verified structurally, not visually, so the owner knows to click through before merging.
2. **www is the canonical host** now consistently (canonical, og:url, og:image, JSON-LD url, sitemap all use `https://www.chromakit.site`). If the owner actually serves the site at bare `chromakit.site`, confirm the non-www→www redirect exists at the DNS/Vercel level (out of scope here).
3. **`vercel.json` redirect is `permanent: false`** (307) for `/docs` — intentional, since the default docs landing page could change. Fine to leave.
4. **Nothing to publish.** Library code is untouched (bundle byte-identical); this is a site-only change. T34's "no version bump" holds.
5. **The DemoPlayground on the home page is still the original `DemoPlayground.tsx`** mounted as an island (`client:visible`) — it was never converted to `.astro` because it's fully interactive (that's correct; it should stay a React island).

## Phase 4 — Sonnet — Housekeeping & handoff ✅ COMPLETE

- [x] **T32. AGENTS.md updated.** Stack/Layout/Commands sections rewritten to match reality (Astro site, library-only `vite.config.ts`, full new directory tree). Added 3 new Gotchas (`.ts` under `pages/` becomes a route, `emptyOutDir` build-order caveat, `eslint-plugin-astro` pin, `astro check` deprecation-hint noise) and a Convention note on static-by-default/islands. Added a full 2026-07-07 Notable Decisions & Lessons entry covering rationale, the island-hydration gotcha, static-icon pattern, the persistent visual-QA gap, and the dead code knip/astro-check surfaced.
- [x] **T33. CLAUDE.md + skill updated.** `verify` now documented as lint+type-check+astro-check; noted `build` after `build:site` wipes the site output. Added a Key Rule pointing at the skill's new Astro section. `react-typescript` skill: broadened its frontmatter scope to `.astro` files and added an "Astro Files (Demo Site Only)" section documenting the live-demo-island pattern and the static-icon trick. **Also fixed a real gap**: `.claude/settings.json`'s PostToolUse hook only auto-linted `.ts/.tsx/.js/.jsx` — `.astro` files never got per-edit auto-lint across all 3 build phases (only caught at Stop-hook `verify` time). Added `*.astro` to the hook's case pattern.
- [x] **T34. README link sanity PASSED.** All `chromakit.site` links use `www` (matches the Phase 3 canonical-host fix). Verified the 3 anchor-fragment links (`#framework-setup`, `#why-oklch` on getting-started; `#type-exports` on troubleshooting) resolve to real `id`s on the corresponding `.astro` pages. No changes needed; no version bump (library untouched).
- [x] **T35. CHANGELOG entry added** under `[Unreleased]` — site-only, notes the SPA→Astro migration, the SEO/JS-payload improvement, and that the library bundle is verified byte-identical.
- [x] **T36. PR** — see final steps below.

**Final gate re-run after Phase 4 doc edits:** `npm run verify` → 0 errors (same pre-existing informational hints as Phase 3, nothing new). `.claude/settings.json` confirmed valid JSON.
