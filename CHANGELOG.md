# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Demo site footer now uses the favicon logo instead of the placeholder gradient square, matching the navbar. _(Demo-site only — not part of the npm package.)_
- **Migrated the demo/docs site from a Vite + React SPA to Astro** (static output with React islands for live picker demos). Every page now renders real, unique HTML (title, description, canonical, OG tags) instead of an empty root div with identical SPA-wide meta tags; static content (docs prose, tables, code blocks) ships zero JavaScript. Added `robots.txt` + sitemap. _(Demo-site only — the published library bundle is unchanged and verified byte-identical.)_

## [0.2.2] - 2026-07-07

### Changed

- Cache-bust the README banner URL so npm renders the refreshed image (npm's image proxy had cached the old banner at the unchanged URL).
- Demo site navbar now uses the favicon logo instead of a placeholder gradient square. _(Demo-site only — not part of the npm package.)_

## [0.2.1] - 2026-07-07

### Fixed

- Excluded the bundle-analysis report (`stats.html`) from the published tarball; the visualizer now writes to `.stats/` instead of `dist/`. Cuts the package unpacked size roughly in half (0.2.0 shipped it inadvertently).

### Changed

- Refreshed the demo site's brand imagery (README banner, Open Graph card, favicon) to the current blue theme. The favicon is now a PNG; the stale orange `favicon.svg` was removed. _(Demo-site assets only — not part of the npm package.)_

## [0.2.0] - 2026-07-06

### Fixed

- `onChangeComplete` reporting the color from before a drag instead of the final color (stale closure in `useColorState`/`usePointerDrag`)
- `RecentColors` showing a stale history snapshot instead of updating live
- Pointer event listeners leaking if a drag is interrupted by unmount
- Invalid nested `<button>` markup in `ColorSwatch` (the preset delete button is now a sibling of the swatch button)
- Numeric channel inputs (RGB/HSL/HSV/OKLCH) snapping mid-edit while typing multi-digit values
- Dark mode reverting on page refresh on the demo site (theme wasn't persisted before first paint)

### Added

- `ColorArea` keyboard support for Home/End (saturation) and PageUp/PageDown (brightness)
- `historySize` prop to cap the color history length (formerly the non-functional `_historySize`)
- Working `height` prop for `ColorPicker`/`ColorArea` (previously ignored; omitting it preserves the auto-stretch behavior)
- Vertical slider styles (`ck-hue-slider--vertical` / `ck-alpha-slider--vertical`) now live in `chromakit.css`

### Changed

- `formatColor`'s `format` parameter is now typed as `ColorFormat` instead of `string`
- Internal restructure into focused modules (`conversions/`, per-component input files, `PickerLayout`); the public export surface is unchanged
- npm package no longer bundles the 1MB readme banner image — installs are ~1MB smaller

### Removed

- **Breaking (types only):** removed the non-functional `theme`/`themes` props and their `ColorPickerTheme`/`ColorTheme` exported types. Theming is done via CSS custom properties in `chromakit.css`, which these props never actually affected.
- **Breaking (minor):** removed the non-functional `size` prop from `ColorSwatch` and `currentColor` from `PresetColors`; `ColorSwatch` now renders inside a `ck-swatch-wrapper` div

## [0.1.16] - 2026-01-29

### Changed

- Documentation and README image updates

## [0.1.15] - 2026-01-29

### Changed

- UI redesign with a blue theme
- Performance optimizations
- Improved NPM docs links
- Required Node 20+ for Vitest 4 compatibility

## [0.1.14] - 2026-01-26

### Fixed

- Duplicate "Contributing" section in README

## [0.1.13] - 2026-01-26

### Changed

- Removed "Made with love by" attribution from README

## [0.1.12] - 2026-01-26

### Changed

- Removed emojis from README

## [0.1.11] - 2026-01-26

### Fixed

- CI test failures

### Changed

- Enhanced README with visuals

## [0.1.10] - 2026-01-26

### Added

- Preset color group dropdown with defaults

### Fixed

- Color picker responsiveness on smaller viewports
- Missing color format support

## [0.1.9] - 2026-01-26

### Removed

- EyeDropper functionality (originally added in [0.1.7])

### Fixed

- CI failures across ESLint, accessibility warnings, and Testing Library v16 compatibility
- Node.js 18.x support (downgraded Vite/Vitest to match)

## [0.1.8] - 2026-01-26

### Changed

- Homepage redesign and documentation audit
- Compact ColorPicker layout (removed `size` prop in favor of explicit dimensions)
- Performance and styling improvements

## [0.1.7] - 2026-01-26

### Added

- Modern color picker library with OKLCH/OKLAB support
- Traditional color space support (RGB, HSL, HSV, HEX)
- Fully composable architecture with standalone components
- Zero production dependencies
- TypeScript-first with complete type definitions
- WCAG AA accessibility compliance
- Built-in dark mode support with glassmorphic design
- EyeDropper API integration for color picking from screen
- Color history with localStorage persistence (10 colors max)
- Keyboard shortcuts (Cmd/Ctrl+C for copy, Cmd/Ctrl+E for eyedropper)
- Size variants (compact, default)
- 8KB gzipped bundle size
- Comprehensive documentation including:
  - Migration guide from react-colorful
  - Contributing guidelines
- Extensive test coverage for utilities and hooks

### Features

- `ColorPicker` - Main orchestrator component
- `ColorArea` - Composable saturation/lightness picker
- `HueSlider` - Standalone hue control
- `AlphaSlider` - Alpha channel control
- `ColorInputs` - Format-specific input fields
- `FormatSelector` - Color format switcher
- `EyeDropperButton` - Screen color picker integration

### Technical

- Built with React 18.3.1
- Vite 7.3.0 for blazing fast builds
- Vitest 4.0.18 for modern testing
- TypeScript 5.6.3 with strict mode
- Tree-shakeable ES modules and UMD builds
- CSS custom properties for theming
- Efficient re-render optimization with React.memo and useMemo

[Unreleased]: https://github.com/garrettsiegel/chromakit/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/garrettsiegel/chromakit/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/garrettsiegel/chromakit/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/garrettsiegel/chromakit/compare/v0.1.16...v0.2.0
[0.1.16]: https://github.com/garrettsiegel/chromakit/compare/v0.1.15...v0.1.16
[0.1.15]: https://github.com/garrettsiegel/chromakit/compare/v0.1.14...v0.1.15
[0.1.14]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.14
[0.1.13]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.13
[0.1.12]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.12
[0.1.11]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.11
[0.1.10]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.10
[0.1.9]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.9
[0.1.8]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.8
[0.1.7]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.7
