# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- ESLint configuration for code quality and consistency
- Prettier configuration for code formatting
- GitHub Actions CI/CD workflow for automated testing and building
- CHANGELOG.md to track project changes
- Comprehensive test suite for ColorPicker component
- Tests for ColorInputs and EyeDropperButton components
- Node.js version specification in package.json

### Fixed

- TypeScript type errors in test files by adding proper vitest jest-dom imports
- Test coverage gaps in main components

### Changed

- Improved development tooling and automation

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
  - Performance benchmarks and analysis
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

[Unreleased]: https://github.com/garrettsiegel/chromakit/compare/v0.1.7...HEAD
[0.1.7]: https://github.com/garrettsiegel/chromakit/releases/tag/v0.1.7
