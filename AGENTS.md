# AGENTS.md — ChromaKit

Living handbook for AI agents working in this package. `CLAUDE.md` is a short pointer to this file plus the pre-finish checklist. Update the **Notable Decisions & Lessons** section when notable mistakes, preferences, or structural decisions occur.

## What this is

`chromakit-react` — a modern, **zero-runtime-dependency** React color picker library (OKLCH/OKLAB/HSL/HSV/RGB/HEX), published to NPM. This repo contains both the **library** and a **demo/marketing site**.

- Published NPM package: **`chromakit-react`** (note the `-react` suffix; the bare `chromakit` name is someone else's).
- Site: https://chromakit.site (static, deployed on Vercel).
- This is its **own git repo**, nested inside the monorepo but independent of it, and **npm-managed** (excluded from the monorepo's pnpm workspace — see the monorepo `AGENTS.md`).

## Stack

- React 18 or 19 (peer dependency; the library declares **no** runtime `dependencies`).
- TypeScript (strict), Vite 7 (library build only — see below), Vitest 4 + Testing Library + jsdom (tests).
- ESLint 9 flat config (`eslint.config.js`), hardened per the "prompt once, lint forever" workflow: hard errors for `any`, non-null assertions, React default/namespace imports, enums, deep relative imports, `eslint-disable` comments (`eslint-comments/no-use`), and size limits (files ≤300, functions ≤200; tests exempt). `--max-warnings 0`.
- **Claude Code hooks** (`.claude/settings.json`): PostToolUse auto-runs `eslint --fix` on every edited ts/tsx/astro file; Stop runs `npm run verify`. The `react-typescript` skill (`.claude/skills/react-typescript/SKILL.md`) documents the standards.
- **Library styles:** hand-written plain CSS in `client/src/lib/color-picker/chromakit.css` (NOT Tailwind). Static styles live in CSS classes; `style` props are reserved for runtime-computed values (live colors, thumb positions) only.
- **Demo/docs site: Astro 7** (static output, `@astrojs/react` islands) + Tailwind **v4** (`@tailwindcss/vite`), loading the legacy `tailwind.config.ts` via `@config` in `client/src/index.css`. Migrated 2026-07 from a Vite+React SPA (wouter) — see Notable Decisions & Lessons for why and the gotchas.

## Layout

```
astro.config.mjs                 # site build: srcDir client/src, outDir dist/public, react()+sitemap()
vercel.json                      # Vercel deploy config; /docs -> /docs/getting-started redirect
vite.config.ts                   # LIBRARY BUILD ONLY (no site branching); injects nothing — __PKG_VERSION__
                                  # is defined in astro.config.mjs's vite.define for the site
tailwind.config.ts               # loaded by the site via @config; library does not use Tailwind
tsconfig.build.json              # declaration-only type build, scoped to the library
playwright.config.ts             # a11y e2e config (e2e/a11y.playwright.ts, axe-core)
lighthouserc.{mobile,desktop,404}.cjs  # Lighthouse CI profiles (minScore: 1)
client/
  public/                        # static assets: favicon.png, og-image.png, site.webmanifest, robots.txt,
                                 #   brand/ (color-study avif/webp/jpg, readme-hero.png, workbench-screenshot.png)
  src/
    lib/color-picker/            # ← THE PUBLISHED LIBRARY (the only code that ships to NPM)
      index.ts                   # public entry / export surface
      types.ts  hooks.ts  utils.ts
      picker-state.ts            # (components/) useColorState + usePresets reducers
      conversions/index.ts       # barrel over conversions/ (hex, hsl, hsv, hwb, lab, oklab,
                                 #   named-colors, parse-format, math)
      chromakit.css              # library styles (imported by index.ts, shipped as a side effect)
      components/                # one component per file:
                                 #   ColorPicker (state) + PickerLayout (markup) + preset-data + picker-state
                                 #   ColorArea, HueSlider, AlphaSlider
                                 #   ColorInputs (text) + ChannelInputs (shared grid) + create-channel-editor
                                 #   RGB/HSL/HSV/OKLCH/OKLABInputs + InputValuePanel
                                 #   ColorPreview, ColorSwatch, PresetColors, CopyButton, RecentColors,
                                 #   EyeDropperButton
      *.test.ts(x)               # colocated tests
    layouts/                     # BaseLayout.astro (head/SEO/GA/theme-script), DocsLayout.astro (sidebar)
    pages/                       # Astro file-based routes — never shipped
      index.astro                # home page
      404.astro
      docs/*.astro               # one file per docs page (getting-started, color-picker, components,
                                 #   hooks, utilities, theming, troubleshooting)
      docs/_nav.ts               # underscore-prefixed = excluded from routing; sidebar order + per-page SEO meta
    site-data/                   # reference-data files (props tables, code snippets) imported by docs pages —
                                 #   MUST live outside pages/ or Astro treats .ts files there as API endpoints
    components/
      demos/                     # React island wrappers, one per live demo (e.g. ConverterDemoCard.tsx) —
                                 #   mounted with client:visible/client:load from .astro pages
      docs/                      # DocSection.astro, PropsTable.astro (+ props-table-types.ts for the shared
                                 #   PropRow type), StaticCode.astro (build-time shiki, zero JS), DemoCard.tsx
                                 #   (the Preview/Code tab wrapper used inside demo islands)
      home/                      # HeroSection/FeaturesSection/FinalCTA/UsageSection.astro (static) +
                                 #   DemoPlayground.tsx (the one fully-interactive home island) +
                                 #   InstallCommandBox.tsx
      layout/                    # SiteHeader.astro, SiteFooter.astro
      shared/                    # site-only primitives reused across demos/docs (CodeBlock,
                                 #   CopyIconButton, ColorFormatsDisplay)
      ThemeToggle.astro          # dark-mode toggle (static astro islands)
      BrandMark.astro            # logo lockup
      ui/                        # shadcn-style primitives kept by the site (card, tabs)
    types/globals.d.ts           # ambient declarations for the site build
    hooks/, index.css            # demo-site-only helpers and global styles
tokens.css                       # site design tokens (imported by client/src/index.css)
e2e/a11y.playwright.ts           # axe-core accessibility suite over built site pages
scripts/generate-brand-assets.mjs # regenerates og-image.png + readme-hero.png (needs sharp)
.github/ACCESSIBILITY_RELEASE_CHECKLIST.md  # manual a11y checks before release
```

The published surface is **only** `client/src/lib/color-picker/`. Everything else under `client/src/` is demo/docs site — never shipped. `client/index.html` no longer exists; Astro generates HTML per-route from `.astro` files.

## Commands

Run from this directory with **npm** (not pnpm). If `node_modules/` is missing, run `npm ci` first.

- `npm run dev` — Astro dev server (demo/docs site).
- `npm run verify` — lint (`--max-warnings 0`) + type-check + `astro check`. The pre-finish gate; also run by the Stop hook.
- `npm run build` — library bundle (`build:lib`, plain `vite build` now) + type declarations (`build:types`).
- `npm run build:site` — `astro build` → static site to `dist/public` (what Vercel deploys).
- `npm run preview` — `astro preview`, serves the built `dist/public` (closest thing to prod locally).
- `npm run test` — Vitest **watch mode** (interactive). For a one-shot run use `npm run test:ci`.
- `npm run test:ci` — one-shot run with coverage (enforces thresholds).
- `npm run test:a11y` — rebuilds the site then runs the Playwright/axe suite (`e2e/`). Playwright needs `npx playwright install --with-deps chromium` once.
- `npm run test:lighthouse` — rebuilds the site then runs the three Lighthouse profiles (minScore: 1).
- `npm run quality:site` — build + Playwright + all Lighthouse profiles in one go.
- `npm run format` / `format:check` — Prettier (`format:check` runs in CI, not in `verify`).
- `npm run size` — size-limit budgets (ES 13.5 KB / UMD 14 KB / CSS 3.75 KB, gzipped). `size:why` opens the bundle analysis.
- `npm run brand:assets` — regenerates `client/public/og-image.png` and `client/public/brand/readme-hero.png` via `scripts/generate-brand-assets.mjs` (sharp).
- `npm run ci` — the full gate GitHub Actions runs.

## Conventions

- **Zero runtime deps in the library.** Never add anything to `dependencies` in `package.json`. UI libs (`@radix-ui/*`, `lucide-react`, etc.) are demo-only and belong in `devDependencies`.
- Tests are colocated (`Foo.test.tsx` next to `Foo.tsx`), Testing Library + Vitest, jsdom environment.
- Public exports go through `client/src/lib/color-picker/index.ts`. Keep the export surface honest — don't export props/types that don't do anything.
- The library CSS uses `ck-`-prefixed class names and `--ck-` CSS custom properties; theming is done by overriding those variables, not via JS props.
- Never publish to NPM as part of a task — version bumps and `npm publish` are the owner's call.
- **Site: static-by-default, islands for interactivity.** New docs/marketing content is a `.astro` page/component. Only wrap something in React + a `client:*` directive when it genuinely needs to run in the browser (a live picker, a copy button, drag/typing). A live demo's interactivity must be composed _inside_ the single React component that gets the `client:*` directive (see `components/demos/*.tsx`) — Astro does not hydrate framework children passed into another component's slot.

## Gotchas

- **Container-query stacking (A4).** The picker stacks based on its OWN width via `@container` queries in `chromakit.css` — not the viewport. An explicit `width` prop lowers the 520 px content floor (PickerLayout writes both `width` and the `--ck-width` var); without it, the picker keeps the 520 px floor, so shrink-wrap parents (flex items, `w-fit`) still render a 520 px picker. Container queries measure the CONTENT box (520 border ≈ 506 content), hence the 505 px query threshold.
- **`extract-zip` advisory is dev-only.** `npm audit --audit-level=moderate` reports 6 findings, all in the `@lhci/cli` → lighthouse → puppeteer-core → extract-zip chain. `extract-zip` has no fixed version (`npm audit fix --force` would downgrade `@lhci/cli` to 0.1.0 — don't). `tmp`/`uuid` are pinned via `overrides` in `package.json`. The published package has zero runtime dependencies (`npm audit --omit=dev` is clean); CI fails only on production advisories.
- **`node_modules/` may be absent.** This repo isn't part of the pnpm workspace, so a monorepo-wide install won't populate it. Run `npm ci` in this dir.
- **`npm run test` is watch mode** and will hang an automated run. Use `npm run test:ci`.
- **`eslint-disable` comments are errors** (and CI greps for them). Fix the code or ask a human to extend the config's `allow` list.
- **`react-hooks` lint forbids writing refs during render.** Sync a "latest value" ref inside a `useEffect`, not with a bare `ref.current = x` at render time.
- **Channel inputs use a focused-field draft** (`ChannelInputs.tsx`): the focused input shows raw typed text; everything else derives from props. No sync-in-effect — don't reintroduce one.
- **Tailwind v4 does not auto-load `tailwind.config.ts`.** The demo relies on `@config "../../tailwind.config.ts";` at the top of `client/src/index.css`. Without it, custom color utilities (`bg-primary`, `text-foreground`, …) silently don't generate.
- **`build:types` needs a CSS module ambient declaration** because `index.ts` imports `./chromakit.css`. Keep `css.d.ts` (`declare module '*.css';`) in the library's type-build include set.
- **OKLCH hue can drift a few degrees** on OKLCH→RGB→OKLCH round trips at high chroma (sRGB gamut clamping). It's color science, not a bug — tests that assert hue stability must use low-chroma colors.
- **`.ts`/`.tsx` files under `client/src/pages/` become Astro routes/endpoints.** Reference data and helper modules that docs pages import must live in `client/src/site-data/` (or another non-`pages/` location), never in `pages/`. `client/src/pages/docs/_nav.ts` is the one exception — the leading underscore tells Astro to exclude it from routing.
- **`build:lib` still wipes `dist/` (`emptyOutDir: true`).** This is intentional — it's what keeps `dist/public` (the site build) out of the npm tarball, since `package.json`'s `files` only lists `dist`. Practical effect: running `npm run build` (or `npm run ci`) after `npm run build:site` deletes the site output; if you need both, build the site _last_, or just re-run `npm run build:site` after.
- **`eslint-plugin-astro` is pinned to `^1.7.0`**, not latest (2.x) — 2.x requires ESLint ≥10 and this repo is on ESLint 9. Don't bump it without also bumping ESLint.
- **`astro check` surfaces `@deprecated` JSDoc hints** that plain `tsc --noEmit` does not always show inline (e.g. lucide-react's brand icons, like `Github`, are marked deprecated package-wide). These show up as informational "hints" in `astro check` output, not errors/warnings — don't chase them down, they don't block `npm run verify`.

## Notable Decisions & Lessons

_Newest at the bottom._

- **2026-07-06**: Full audit + remediation completed (was tracked in a now-deleted `UPDATES.md` work plan). Key outcomes:
  - **Stale-closure fix in `hooks.ts`**: `endDrag` reads a `colorValueRef` (synced in `useEffect`) so `onChangeComplete` reports the _final_ drag color; `usePointerDrag` keeps latest callbacks in refs and cleans up `document` listeners on unmount.
  - **Public API honesty**: implemented `height` and `historySize` (formerly dead props); **removed** the non-functional `theme`/`themes` props and `ColorPickerTheme`/`ColorTheme` types (theming is via CSS vars). `formatColor` typed to `ColorFormat`.
  - **Tailwind config was dead** under v4 — restored via `@config` (see Gotchas).
  - **npm/pnpm**: chromakit excluded from the monorepo pnpm workspace; manage with npm here only.
- **2026-07-06**: **Ship-ready cleanup + lint enforcement (v0.2.0 prep).**
  - Adopted the "prompt once, lint forever" workflow (`~/Desktop/monorepo/eslint-rules_fable.md`): hardened `eslint.config.js`, added `.claude/settings.json` hooks (PostToolUse eslint --fix per edit; Stop → `npm run verify`), converted the old `.claude/SKILL.md` into a real skill at `.claude/skills/react-typescript/`, and added a CI grep gate blocking `eslint-disable`.
  - Eliminated all 7 `eslint-disable` directives: the 4 `set-state-in-effect` ones by replacing the channel-inputs sync-in-effect with the focused-field draft pattern (shared `ChannelInputs` grid — also collapsed 4 near-identical components into thin config wrappers); tailwind `require()` → ESM imports; deleted the obsolete `vitest-setup.d.ts` (jest-dom v6 ships its own vitest types).
  - Split oversized files: `ColorPicker.tsx` → + `PickerLayout.tsx` + `preset-data.ts`; `ColorInputs.tsx` → per-component files; `ColorPreview.tsx` → + `ColorSwatch.tsx` + `PresetColors.tsx`; `conversions.ts` → barrel over `conversions/` modules. Public API re-exports unchanged.
  - **Fixed the invalid nested `<button>` in `ColorSwatch`** (delete button is now a sibling inside `.ck-swatch-wrapper`; hover reveal moved to the wrapper selector). Also removed dead `size`/`currentColor` props from `ColorSwatch`/`PresetColors`.
  - Static inline styles moved to CSS classes (including the previously-missing `--vertical` slider rules, which existed as class names but had no CSS); `style` props are now dynamic-values-only by convention (no ESLint rule — a color picker must inject computed colors; deviation from the fable doc documented here).
  - `max-lines-per-function` set to 200, not the fable doc's 80 — JSX layout components (`PickerLayout` ~190 effective lines) made 80 unviable; 300/200 are the enforced ceilings.
  - Removed: Twitter links/meta, dependabot.yml, Copilot instruction files, `react-dr-cli` (dep+scripts+prompt), `components.json`, `UPDATES.md`/`CORRECT-USAGE.md`/`README-IMAGES.md`, duplicate root `og-image.png`, placeholder `twitter-card.png`. `chromakit.png` dropped from the npm `files` (README now uses the raw.githubusercontent URL) — tarball ~1MB slimmer.
  - Demo version badge now comes from a Vite `define` (`__PKG_VERSION__`) instead of a deep `package.json` import.
- **2026-07-07**: **Demo/docs site migrated from Vite+React SPA to Astro** (static output + React islands), across 4 agent phases on the `astro-migration` branch. Rationale: the site is content-heavy (docs/marketing) with pockets of interactivity — every SPA route previously shipped an empty `<div id="root">` plus a ~360KB JS bundle to crawlers, and all pages shared identical meta/OG/canonical tags. Astro gives real per-page HTML, unique per-page SEO, and ships JS only for the live picker demos.
  - **Library untouched and proven so**: `vite.config.ts` was slimmed to library-build-only (no more mode branching); `npm run build`'s ES bundle stayed gzip-byte-identical (11.39 kB) across all 4 phases, and `npm pack --dry-run` still shows the same ~34-file tarball (`dist/` + README + LICENSE, zero site files) — the `build:lib` `emptyOutDir` wipe is what enforces that (see Gotchas).
  - **wouter removed** (was the SPA's client-side router) — Astro's file-based routing under `client/src/pages/` replaced it entirely; `/docs/:slug` became 7 separate `.astro` files.
  - **The live-demo-as-island pattern** was the trickiest part: Astro renders a framework component's _children_ as static markup even when the parent has a `client:*` directive, so a demo nested inside another React component's slot silently fails to hydrate. The fix was one small React wrapper component per live demo (`components/demos/*.tsx`, e.g. `ConverterDemoCard.tsx`) that composes the demo _and_ its `DemoCard` (Preview/Code tabs) together, mounted as a single island.
  - **Static icons**: importing a `lucide-react` icon component into an `.astro` template with no `client:*` directive server-renders it to plain HTML with zero shipped JS — used this instead of hand-drawing SVG paths for pixel-perfect, cost-free icons.
  - **Visual/interactive QA was never actually possible** during this migration — the Chrome browser extension could not connect in any of the 4 phases. Everything was verified via build output, route status codes, content greps, and `<astro-island>` markup (`component-url` resolving to a real on-disk chunk, correct `client="visible"`/`"load"` attributes). This is strong circumstantial evidence the site works, but nobody has clicked a button in a real browser — do that before trusting a subsequent change that touches interactive islands.
  - **Housekeeping found real dead code**: `astro check` (added to `verify`) and `knip` (repointed at `.astro` entries) together caught a stale `client/src/main.tsx` reference and 3 orphaned React components left behind by the port (`badge.tsx`, `DocSection.tsx`, and the `PropsTable.tsx` component — its `PropRow` type was still used, so the file became a type-only `PropsTable.ts`, not deleted).
  - **`eslint-plugin-astro` pinned to `^1.7.0`** — the current major (2.x) needs ESLint ≥10; this repo is on ESLint 9.
- **2026-07-07**: **Prod site was rendering an _unstyled_ color picker (dev was fine)** — the library's `chromakit.css` was silently tree-shaken out of the production site build. Root cause: `lib/color-picker/index.ts` pulls in the styles via a bare `import './chromakit.css'` (a side-effect-only import), but `package.json`'s `sideEffects` array listed only `*.css`/`**/*.css`. That marks the CSS module itself as side-effectful, but Rollup only _retains_ a module's side-effect-only imports if the **importing** module also has side effects — and `index.ts` (a pure re-export barrel) was flagged `moduleSideEffects: false`, so Rollup dropped the CSS import entirely. Dev worked because Vite dev doesn't tree-shake. Fix: add `./client/src/lib/color-picker/index.ts` to `sideEffects` so the barrel's CSS import survives. Notes for future debugging:
  - The `moduleSideEffects` flag on the CSS module is **not** the signal — it stays `no-treeshake` in both broken and fixed builds. The deciding factor is the flag on the _importer_ (`index.ts`). Diffing per-module flags between builds shows nothing; the difference is in Rollup's dependency-inclusion walk (`addRelevantSideEffectDependencies`), which skips a dependency whose importer isn't itself side-effectful.
  - Reproduces in **plain Vite** (no Astro) with a two-line entry importing `{ ColorPicker }` from the source barrel — bisect there, not in the full Astro build.
  - This entry is inert for the **published npm package** (the glob points at a `client/src/...` source path that isn't in the `dist`-only tarball); it only fixes the site's source-consumption path. npm consumers are still told to `import 'chromakit-react/chromakit.css'` explicitly (docs unchanged), and library-build size budgets are unaffected (ES bundle stayed 9.42 kB gzip).

- **2026-08-28**: Repo-wide cleanup pass (library + site), no behavior or public-API change — the built bundle's 64 runtime exports are byte-identical before and after.
  - **Single-format text input now goes through `ColorInputs`.** `InputValuePanel` had its own derived-value `<input>` with no draft state, so half-typed colors (`#f0`, `rg`) snapped back mid-edit; `ColorInputs` already solved that and was orphaned. `ColorInputs` gained optional `showCopyButton`/`onCopy`; the format `<select>` stays in `PickerLayout` where it belongs visually.
  - **`PickerLayout` props went 28 → 21** by passing the `useColorState` and `usePresets` return objects whole (`color`, `presets`) instead of spraying their fields. `handleUpdatePreset`/`handleAddPreset` wrappers and the `dimensions` memo are gone; the color area's fixed width is a named `AREA_WIDTH` constant.
  - **The five `*Inputs` components are one factory.** `createChannelEditor({ space, channels, select, serialize })` builds RGB/HSL/HSV/OKLCH/OKLAB; `inputId`/`testId` derive from the space name and channel key, so the tables shrank and the ids are guaranteed consistent. `HSVInputs` now serializes via `hsvaToRgba` instead of hand-rolled HSV→HSL math.
  - **Shared conversion math lives in `conversions/math.ts`**: `rgbToHue` (was duplicated three times in two different styles) and `srgbToLinear`/`linearToSrgbChannel`/`linearToSrgb` (was duplicated in `lab.ts` and `oklab.ts`).
  - **Barrels collapsed**: `conversions.ts` moved to `conversions/index.ts`, and `index.ts` now does `export *` for conversions, hooks, and utils instead of re-listing ~50 names by hand. Keep those three modules' exports intentional — everything they export is now public API.
  - **Preset cap is one constant** (`MAX_CUSTOM_PRESETS`, exported from `picker-state.ts`); the reducer's dead `'reset'` action is gone.
  - **Site**: `ui/button.tsx` (shadcn cva + radix Slot, one consumer) deleted along with the `--sidebar-*`/`--chart-*` tokens and the elevate CSS block, dropping the `@radix-ui/react-slot` and `class-variance-authority` devDeps; `components/demo/` merged into `shared/` + `demos/`; the site's `CopyButton` renamed `CopyIconButton` so it no longer collides with the library's; `lib/constants.ts` folded into its one consumer; `PropsTable.ts` renamed `props-table-types.ts`. ESLint now writes its cache to `node_modules/.cache/eslint/` so stray `.eslintcache` files stop appearing under `src/`.
- **2026-08-29**: **v0.5.1 — editorial workbench redesign + a11y test gates.** Home page redesigned (workbench layout, self-hosted variable fonts in `client/public/fonts/` via `@font-face` — no fontsource packages). Added real accessibility CI: Playwright + axe (`e2e/a11y.playwright.ts`, `npm run test:a11y`) and Lighthouse CI with `minScore: 1` across mobile/desktop/404 profiles (`npm run test:lighthouse`). `.github/ACCESSIBILITY_RELEASE_CHECKLIST.md` tracks pre-release manual checks; two items remain deferred (native VoiceOver pass, macOS Increased Contrast pass).
- **2026-09-02**: **SCAN.md remediation — all 8 batches implemented** (branches `scan/hygiene` → `scan/api`, stacked PRs #8–#15; SCAN.md deleted per its own completion rule). P0 parse fixes landed: CSS Color 4 space-separated `rgb()`/`hsl()`, percentage alpha, deg/negative hues, `oklch()` alpha clamping, and `hsv()`/`hsva()` round-tripping (parsers extracted to `conversions/parse-css-functions.ts`). Interaction: `pointercancel` ends drags, ColorSwatch long-press no longer double-fires, CopyButton timer cleanup, mode-button `onKeyDown` removed. CSS: the `width` prop now works below 520px via container queries — **the picker's stacking is keyed to its own width, and `PickerLayout` writes both `width` and the `--ck-width` var so an explicit width lowers the 520px content floor; container queries measure the content box (505px query ≈ 520px border)**. Reduced-motion/forced-colors rules ship in the library CSS; preset delete hit area ≥ 24×24. Tooling: prettier enforced in CI, honest CI security gate (prod must be clean, dev-only advisory), coverage thresholds raised to 92/92/88/92, sharp+`brand:assets`, vite@8/Rolldown (ES 12.54 kB gzip), lucide@1, jsdom@30, jest-dom@7. Prop types exported. **Deferred:** T8 Stage B (eslint@10) reverted per the plan's stop rule — eslint-plugin-react/jsx-a11y have no ESLint-10-compatible releases; the @eslint-community/eslint-comments fork swap stands. B3 (formatColor precision) needs the owner's call.
