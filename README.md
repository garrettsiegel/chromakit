<div align="center">
  <img src="https://raw.githubusercontent.com/garrettsiegel/chromakit/main/client/public/brand/readme-hero.png" alt="The ChromaKit picker-glyph logo and wordmark beside a live OKLCH color picker" width="100%" />

# ChromaKit

A React color picker and conversion toolkit. OKLCH, OKLAB, HSL, HSV, RGB, and HEX, with zero runtime dependencies.

[![npm version](https://img.shields.io/npm/v/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![CI](https://github.com/garrettsiegel/chromakit/actions/workflows/ci.yml/badge.svg)](https://github.com/garrettsiegel/chromakit/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/chromakit-react.svg)](https://github.com/garrettsiegel/chromakit/blob/main/LICENSE)

[Live demo](https://www.chromakit.site/) · [Documentation](https://www.chromakit.site/docs/getting-started) · [npm](https://www.npmjs.com/package/chromakit-react)

</div>

## What's in the package

ChromaKit combines a complete color picker, composable picker primitives, color parsing, conversion utilities, and WCAG contrast helpers in one TypeScript package. It supports React 18 and 19 and declares zero runtime dependencies.

Gzipped sizes for v0.7.0, measured with `size-limit`:

| Asset      | Gzipped size |
| ---------- | -----------: |
| ES module  |      12.7 kB |
| UMD module |      13.4 kB |
| CSS        |       3.8 kB |

## Install

```bash
npm install chromakit-react
```

Import the component and its stylesheet:

```tsx
import { useState } from 'react';
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

export function BrandColorField() {
  const [color, setColor] = useState('#ddfe3f');

  return <ColorPicker value={color} onChange={(next) => setColor(next.hex8)} />;
}
```

`onChange` receives one `ColorValue` with every supported format, so you can store whichever format your system uses.

## Color formats

The picker, `parseColor`, and conversion utilities work with:

| Family           | Input and output                                       |
| ---------------- | ------------------------------------------------------ |
| Hex              | `#rgb`, `#rrggbb`, `#rrggbbaa`                         |
| RGB              | `rgb()`, `rgba()`                                      |
| HSL              | `hsl()`, `hsla()`                                      |
| HSV              | object and formatted utility output                    |
| OKLab            | `oklab()`, alpha-aware objects                         |
| OKLCH            | `oklch()`, alpha-aware objects                         |
| Additional input | named colors, `transparent`, HWB, CIE Lab, and CIE LCH |

Out-of-gamut OKLCH and OKLab values are mapped into sRGB by reducing chroma while preserving lightness and hue.

## Controlled usage

Use `value` with `onChange` when the picker participates in form state, design-token editing, undo/redo, or persistence. Use `defaultValue` when ChromaKit can own the local value.

```tsx
import type { ColorValue } from 'chromakit-react';

function handleChange(next: ColorValue) {
  saveToken({
    hex: next.hex8,
    oklch: next.oklch,
    rgb: next.rgb,
  });
}

<ColorPicker
  value="oklch(72% 0.16 48)"
  onChange={handleChange}
  onChangeComplete={commitToken}
  showAlpha
/>;
```

By default the picker is compact: a 280px column with one format dropdown and a single row of preset and recent swatches. Pass `layout="wide"` for a 520px side-by-side version with the color area on the left and a preset-group menu.

The full component also supports a custom format list, presets and preset groups, recent-color history (on by default), an eyedropper where the browser supports it, and a configurable color-area height.

[Read the complete `ColorPicker` prop reference](https://www.chromakit.site/docs/color-picker).

## Theming

The picker is styled with `--ck-*` CSS custom properties. Add a class to the picker and override the values your design system owns:

```css
.brand-picker {
  --ck-primary: #202516;
  --ck-accent: #ddfe3f;
  --ck-glass-bg: #f6f3e9;
  --ck-text: #12140e;
  --ck-radius: 2px;
  --ck-radius-md: 2px;
}
```

```tsx
<ColorPicker className="brand-picker" defaultValue="#ddfe3f" />
```

The default theme is flat: white and black, hairline borders, square corners. Add `className="ck-theme-glass"` for the previous frosted-glass look.

[See every theme variable and a live comparison](https://www.chromakit.site/docs/theming).

## Accessibility behavior

ChromaKit provides multiple ways to reach the same color value:

- The visual color plane is a labeled group with separate saturation and brightness sliders.
- Hue, alpha, saturation, and brightness support arrow keys, Home/End, and larger keyboard steps.
- Text and numeric fields provide non-drag alternatives for precise input.
- Primary interactive targets are at least 44×44 CSS pixels; auxiliary
  targets (like the preset delete control) have a hit area of at least
  24×24 CSS pixels. All interactive elements have visible focus treatment.
- Copy actions expose text status instead of relying on color or icon changes alone.
- WCAG luminance and contrast-ratio helpers are exported for applications that build their own contrast checks.

These behaviors are a starting point, not a guarantee. Test the picker inside your own labels, forms, themes, and page structure.

## Compose your own picker

`ColorPicker` is built from the same public components and hooks you can import:

```tsx
import {
  AlphaSlider,
  ColorArea,
  HueSlider,
  OKLCHInputs,
  useColorState,
} from 'chromakit-react';

export function TokenEditor() {
  const color = useColorState('#b7c0ff');

  return (
    <div>
      <ColorArea hsva={color.hsva} onChange={color.updateColor} />
      <HueSlider hsva={color.hsva} onChange={color.updateColor} />
      <AlphaSlider hsva={color.hsva} onChange={color.updateColor} />
      <OKLCHInputs
        colorValue={color.colorValue}
        onChange={color.setFromString}
      />
    </div>
  );
}
```

[Browse components](https://www.chromakit.site/docs/components), [hooks](https://www.chromakit.site/docs/hooks), and [color utilities](https://www.chromakit.site/docs/utilities).

## Platform support

| Surface          | Support                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| React            | 18 and 19 peer dependencies                                                          |
| Browsers         | Current Chrome, Edge, Firefox, and Safari                                            |
| EyeDropper       | Rendered only when the browser exposes the API                                       |
| Server rendering | ES module includes a `'use client'` directive; Pages Router can use a dynamic import |
| Build tooling    | Node.js 20 or newer                                                                  |

ChromaKit computes OKLCH and OKLab in JavaScript. CSS `oklch()` support is needed only when an application renders that string directly.

## Documentation

- [Getting started and framework setup](https://www.chromakit.site/docs/getting-started)
- [`ColorPicker` API](https://www.chromakit.site/docs/color-picker)
- [Composable components](https://www.chromakit.site/docs/components)
- [Hooks](https://www.chromakit.site/docs/hooks)
- [Color utilities](https://www.chromakit.site/docs/utilities)
- [Theming](https://www.chromakit.site/docs/theming)
- [Troubleshooting and exported types](https://www.chromakit.site/docs/troubleshooting)
- [Upgrading from 0.6](https://github.com/garrettsiegel/chromakit/blob/main/MIGRATION.md#upgrading-from-chromakit-react-06)
- [Migrating from react-colorful](https://github.com/garrettsiegel/chromakit/blob/main/MIGRATION.md#migrating-from-react-colorful-to-chromakit)

## Contributing

Issues and focused pull requests are welcome. Read the [contributing guide](https://github.com/garrettsiegel/chromakit/blob/main/CONTRIBUTING.md), then run the same checks used by CI:

```bash
npm ci
npm run verify
npm run build
npm run size
```

Release notes live in the [changelog](https://github.com/garrettsiegel/chromakit/blob/main/CHANGELOG.md). Package publishing and version changes remain maintainer actions.

## License

MIT © [Garrett Siegel](https://github.com/garrettsiegel)
