<div align="center">
  <img src="https://raw.githubusercontent.com/garrettsiegel/chromakit/main/client/public/brand/readme-hero.png" alt="ChromaKit editorial color workbench showing a real picker, synchronized OKLCH values, and format outputs" width="100%" />

# ChromaKit

A controlled React color picker and conversion toolkit for modern color systems.

[![npm version](https://img.shields.io/npm/v/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![CI](https://github.com/garrettsiegel/chromakit/actions/workflows/ci.yml/badge.svg)](https://github.com/garrettsiegel/chromakit/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/chromakit-react.svg)](https://github.com/garrettsiegel/chromakit/blob/main/LICENSE)

[Live workbench](https://www.chromakit.site/) · [Documentation](https://www.chromakit.site/docs/getting-started) · [npm](https://www.npmjs.com/package/chromakit-react)

</div>

## What it gives you

ChromaKit combines a complete color picker, composable picker primitives, color parsing, conversion utilities, and WCAG contrast helpers in one TypeScript package. It supports React 18 and 19 and declares zero runtime dependencies.

Current production budgets, measured with `size-limit` for v0.5.1:

| Asset      | Gzipped size |
| ---------- | -----------: |
| ES module  |      12.7 kB |
| UMD module |      13.3 kB |
| CSS        |       3.5 kB |

## Install

```bash
npm install chromakit-react
```

Import both the component and its stylesheet:

```tsx
import { useState } from 'react';
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

export function BrandColorField() {
  const [color, setColor] = useState('#ddfe3f');

  return <ColorPicker value={color} onChange={(next) => setColor(next.hex8)} />;
}
```

`onChange` returns one `ColorValue` containing every supported representation, so application state can stay in the format that fits your system.

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

The full component also supports custom formats, presets and preset groups, recent-color history, eyedropper progressive enhancement, and independent color-area height.

[Read the complete `ColorPicker` prop reference](https://www.chromakit.site/docs/color-picker).

## Theming

The package skin is controlled by documented `--ck-*` custom properties. Add a class to the picker and override the values your design system owns:

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
- WCAG contrast-ratio and readable-text helpers are exported for applications that build their own contrast interface.

These behaviors support accessible product implementation; teams should still test the picker inside their own labels, forms, themes, and page structure.

## Compose your own picker

The complete picker is assembled from the same public pieces available to consumers:

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
- [Hooks and utilities](https://www.chromakit.site/docs/hooks)
- [Troubleshooting and exported types](https://www.chromakit.site/docs/troubleshooting)
- [Migrating from react-colorful](./MIGRATION.md)

## Contributing

Issues and focused pull requests are welcome. Read the [contributing guide](https://github.com/garrettsiegel/chromakit/blob/main/CONTRIBUTING.md), then run the same checks used by CI:

```bash
npm ci
npm run verify
npm run test:ci
npm run build
npm run size
```

Release notes live in the [changelog](https://github.com/garrettsiegel/chromakit/blob/main/CHANGELOG.md). Package publishing and version changes remain maintainer actions.

## License

MIT © [Garrett Siegel](https://github.com/garrettsiegel)
