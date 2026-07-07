# AGENTS.md — ChromaKit

Living handbook for AI agents working in this package. `CLAUDE.md` is a short pointer to this file plus the pre-finish checklist. Update the **Notable Decisions & Lessons** section when notable mistakes, preferences, or structural decisions occur.

## What this is

`chromakit-react` — a modern, **zero-runtime-dependency** React color picker library (OKLCH/OKLAB/HSL/HSV/RGB/HEX), published to NPM. This repo contains both the **library** and a **demo/marketing site**.

- Published NPM package: **`chromakit-react`** (note the `-react` suffix; the bare `chromakit` name is someone else's).
- Site: https://chromakit.site (static, deployed on Vercel).
- This is its **own git repo**, nested inside the monorepo but independent of it, and **npm-managed** (excluded from the monorepo's pnpm workspace — see the monorepo `AGENTS.md`).

## Stack

- React 18 or 19 (peer dependency; the library declares **no** runtime `dependencies`).
- TypeScript (strict), Vite 7 (build), Vitest 4 + Testing Library + jsdom (tests).
- ESLint 9 flat config (`eslint.config.js`), hardened per the "prompt once, lint forever" workflow: hard errors for `any`, non-null assertions, React default/namespace imports, enums, deep relative imports, `eslint-disable` comments (`eslint-comments/no-use`), and size limits (files ≤300, functions ≤200; tests exempt). `--max-warnings 0`.
- **Claude Code hooks** (`.claude/settings.json`): PostToolUse auto-runs `eslint --fix` on every edited ts/tsx file; Stop runs `npm run verify`. The `react-typescript` skill (`.claude/skills/react-typescript/SKILL.md`) documents the standards.
- **Library styles:** hand-written plain CSS in `client/src/lib/color-picker/chromakit.css` (NOT Tailwind). Static styles live in CSS classes; `style` props are reserved for runtime-computed values (live colors, thumb positions) only.
- **Demo site styles:** Tailwind **v4** (`@tailwindcss/vite`), loading the legacy `tailwind.config.ts` via `@config` in `client/src/index.css`.

## Layout

```
client/
  index.html                     # demo site entry (inline pre-paint theme script)
  public/                        # static assets (favicon.svg, og-image.png, site.webmanifest)
  src/
    lib/color-picker/            # ← THE PUBLISHED LIBRARY (the only code that ships to NPM)
      index.ts                   # public entry / export surface
      types.ts  hooks.ts  utils.ts
      conversions.ts             # barrel over conversions/ (hex, hsl, hsv, oklab, parse-format, math)
      chromakit.css              # library styles (imported by index.ts, shipped as a side effect)
      components/                # one component per file:
                                 #   ColorPicker (state) + PickerLayout (markup) + preset-data
                                 #   ColorArea, HueSlider, AlphaSlider
                                 #   ColorInputs (text) + ChannelInputs (shared grid) + RGB/HSL/HSV/OKLCHInputs
                                 #   ColorPreview, ColorSwatch, PresetColors, CopyButton, RecentColors
      *.test.ts(x)               # colocated tests
    components/, pages/, hooks/  # demo site only (never shipped)
tailwind.config.ts               # loaded by the DEMO via @config; library does not use Tailwind
vite.config.ts                   # dual-mode: library (--mode lib) vs demo site; injects __PKG_VERSION__
tsconfig.build.json              # declaration-only type build, scoped to the library
```

The published surface is **only** `client/src/lib/color-picker/`. Changes under `client/src/components/`, `pages/`, etc. affect the demo site, never the NPM package.

## Commands

Run from this directory with **npm** (not pnpm). If `node_modules/` is missing, run `npm ci` first.

- `npm run dev` — Vite dev server (demo site).
- `npm run verify` — lint (`--max-warnings 0`) + type-check. The pre-finish gate; also run by the Stop hook.
- `npm run build` — library bundle (`build:lib`) + type declarations (`build:types`).
- `npm run build:site` — build the demo site to `dist/public` (what Vercel deploys).
- `npm run test` — Vitest **watch mode** (interactive). For a one-shot run use `npm run test:ci`.
- `npm run test:ci` — one-shot run with coverage (enforces thresholds).
- `npm run size` — size-limit budgets (ES 12KB / UMD 10.5KB / CSS 3KB, gzipped).
- `npm run ci` — the full gate GitHub Actions runs.

## Conventions

- **Zero runtime deps in the library.** Never add anything to `dependencies` in `package.json`. UI libs (`@radix-ui/*`, `lucide-react`, etc.) are demo-only and belong in `devDependencies`.
- Tests are colocated (`Foo.test.tsx` next to `Foo.tsx`), Testing Library + Vitest, jsdom environment.
- Public exports go through `client/src/lib/color-picker/index.ts`. Keep the export surface honest — don't export props/types that don't do anything.
- The library CSS uses `ck-`-prefixed class names and `--ck-` CSS custom properties; theming is done by overriding those variables, not via JS props.
- Never publish to NPM as part of a task — version bumps and `npm publish` are the owner's call.

## Gotchas

- **`node_modules/` may be absent.** This repo isn't part of the pnpm workspace, so a monorepo-wide install won't populate it. Run `npm ci` in this dir.
- **`npm run test` is watch mode** and will hang an automated run. Use `npm run test:ci`.
- **`eslint-disable` comments are errors** (and CI greps for them). Fix the code or ask a human to extend the config's `allow` list.
- **`react-hooks` lint forbids writing refs during render.** Sync a "latest value" ref inside a `useEffect`, not with a bare `ref.current = x` at render time.
- **Channel inputs use a focused-field draft** (`ChannelInputs.tsx`): the focused input shows raw typed text; everything else derives from props. No sync-in-effect — don't reintroduce one.
- **Tailwind v4 does not auto-load `tailwind.config.ts`.** The demo relies on `@config "../../tailwind.config.ts";` at the top of `client/src/index.css`. Without it, custom color utilities (`bg-primary`, `text-foreground`, …) silently don't generate.
- **`build:types` needs a CSS module ambient declaration** because `index.ts` imports `./chromakit.css`. Keep `css.d.ts` (`declare module '*.css';`) in the library's type-build include set.
- **OKLCH hue can drift a few degrees** on OKLCH→RGB→OKLCH round trips at high chroma (sRGB gamut clamping). It's color science, not a bug — tests that assert hue stability must use low-chroma colors.

## Notable Decisions & Lessons

_Newest at the bottom._

- **2026-07-06**: Full audit + remediation completed (was tracked in a now-deleted `UPDATES.md` work plan). Key outcomes:
  - **Stale-closure fix in `hooks.ts`**: `endDrag` reads a `colorValueRef` (synced in `useEffect`) so `onChangeComplete` reports the *final* drag color; `usePointerDrag` keeps latest callbacks in refs and cleans up `document` listeners on unmount.
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
