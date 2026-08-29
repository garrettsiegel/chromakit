<div align="center">

# ChromaKit

### The Modern React Color Picker with Perceptually Uniform Colors

**Build better design systems with OKLCH color space support**

[![npm version](https://img.shields.io/npm/v/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![npm downloads](https://img.shields.io/npm/dm/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/chromakit-react)](https://bundlephobia.com/package/chromakit-react)
[![license](https://img.shields.io/npm/l/chromakit-react.svg)](https://github.com/garrettsiegel/chromakit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

[**Live Demo**](https://www.chromakit.site) • [**Documentation**](https://www.chromakit.site/docs) • [**Migration Guide**](./MIGRATION.md)

---

```bash
npm install chromakit-react
```

<br />

**[See it in action →](https://www.chromakit.site)**

<br />

<img src="https://raw.githubusercontent.com/garrettsiegel/chromakit/main/chromakit.png?v=0.2.3" alt="ChromaKit - Modern React color picker with OKLCH support" width="100%" />

</div>

<br />

> **Full documentation lives on the web**, where every API is paired with a live,
> interactive example: **[chromakit.site/docs →](https://www.chromakit.site/docs)**

## Why Developers Choose ChromaKit

**The only React color picker built for modern design systems.** While other pickers struggle with consistent color scales and muddy gradients, ChromaKit uses perceptually uniform color spaces (OKLCH, OKLAB) to deliver what designers expect and users see.

```tsx
// Get started in 30 seconds
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

<ColorPicker onChange={(color) => console.log(color.oklch)} />;
```

### Perfect For

- **Design System Engineers** — Generate consistent tonal scales with predictable lightness
- **Accessibility Teams** — Built-in WCAG AA/AAA contrast checking
- **App Developers** — Zero dependencies, ~10KB bundle, works everywhere
- **UI Libraries** — Composable primitives, full TypeScript support

### Comparison

| Feature      | ChromaKit   | react-colorful | react-color |
| ------------ | ----------- | -------------- | ----------- |
| Bundle Size  | ~10KB       | ~3KB           | ~28KB       |
| OKLCH/OKLAB  | ✅          | ❌             | ❌          |
| Composable   | ✅          | Limited        | ❌          |
| TypeScript   | ✅ Native   | ✅             | ⚠️ @types   |
| Dark Mode    | ✅ Built-in | Manual         | Manual      |
| Dependencies | 0           | 0              | Many        |

**Choose ChromaKit for:** Design systems, OKLCH support, accessibility features, composability
**Choose react-colorful for:** Minimal bundle size (<5KB), traditional RGB/HSL only

[Migration Guide](./MIGRATION.md) available for switching from react-colorful or react-color.

---

## Quick Start

**Controlled Component** (recommended)

```tsx
import { useState } from 'react';
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function App() {
  const [color, setColor] = useState('#6366F1');

  return (
    <ColorPicker
      value={color}
      onChange={(colorValue) => setColor(colorValue.hex)}
    />
  );
}
```

That's it — a fully-featured color picker with OKLCH support, color history, presets, and copy-to-clipboard, out of the box.

> New to the library? The **[Getting Started guide](https://www.chromakit.site/docs/getting-started)** walks through installation, framework setup, and your first picker with live examples.

---

## Why OKLCH?

OKLCH is a **perceptually uniform** color space — equal numerical changes produce equal visual differences, which HSL cannot promise.

- **Predictable lightness** — a given L looks equally bright at every hue
- **Smoother gradients** — no muddy middle tones
- **Consistent scales** — generate tonal palettes with uniform visual weight
- **Wider gamut** — reach more vivid colors on modern displays

```tsx
// HSL: same lightness value, different perceived brightness
hsl(240, 100%, 50%) // Blue  — looks dark
hsl(60, 100%, 50%)  // Yellow — looks bright

// OKLCH: same lightness = same perceived brightness
oklch(50% 0.2 240)  // Blue   at 50% brightness
oklch(50% 0.2 60)   // Yellow at 50% brightness
```

[Read more about OKLCH →](https://www.chromakit.site/docs/getting-started#why-oklch)

---

## Accepted Color Strings

`parseColor`, the `value` prop, and the text field all accept:

| Form          | Examples                                      |
| ------------- | --------------------------------------------- |
| Hex           | `#f00`, `#ff0000`, `#ff0000cc`                |
| Keywords      | `red`, `rebeccapurple`, `transparent`         |
| RGB / HSL     | `rgb(255, 0, 0)`, `hsla(0, 100%, 50%, 0.5)`   |
| HWB           | `hwb(0 0% 0%)`, `hwb(0deg 0% 0% / 50%)`       |
| CIE Lab / LCH | `lab(54% 80.8 69.9)`, `lch(54% 106.8 40.9)`   |
| OKLab / OKLCH | `oklab(0.63 0.22 0.13)`, `oklch(63% 0.26 29)` |

Colors outside the sRGB gamut are mapped by reducing chroma at constant lightness and hue, per CSS Color 4, so vivid inputs keep their hue.

---

## Framework Setup

**Next.js App Router** — works out of the box; the bundle ships its own `'use client'` directive, so no wrapper file is needed:

```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';
```

**Next.js Pages Router (SSR)** — load it dynamically:

```tsx
import dynamic from 'next/dynamic';

const ColorPicker = dynamic(
  () => import('chromakit-react').then((mod) => mod.ColorPicker),
  { ssr: false }
);
```

**Vite / CRA** — works out of the box.

Full details: **[Framework setup docs →](https://www.chromakit.site/docs/getting-started#framework-setup)**

---

## API Reference: `<ColorPicker />`

The batteries-included component — color area, hue/alpha sliders, format-switchable inputs, presets, history, and copy.

| Prop               | Type                                        | Default        | Description                                    |
| ------------------ | ------------------------------------------- | -------------- | ---------------------------------------------- |
| `value`            | `string`                                    | —              | Controlled color in any supported format       |
| `defaultValue`     | `string`                                    | `'#6366F1'`    | Initial color for uncontrolled mode            |
| `onChange`         | `(color: ColorValue) => void`               | —              | Fires on every change (drag, typing)           |
| `onChangeComplete` | `(color: ColorValue) => void`               | —              | Fires when a change settles (pointer up)       |
| `formats`          | `ColorFormat[]`                             | all 11 formats | Which format tabs the inputs expose            |
| `showAlpha`        | `boolean`                                   | `true`         | Show the alpha (transparency) slider           |
| `showInputs`       | `boolean`                                   | `true`         | Show the numeric / text input fields           |
| `showPreview`      | `boolean`                                   | `true`         | Show the color preview swatch                  |
| `showPresets`      | `boolean`                                   | `true`         | Show the preset color swatches section         |
| `showCopyButton`   | `boolean`                                   | `true`         | Show the copy-to-clipboard button              |
| `presets`          | `string[]`                                  | built-in       | Custom preset colors                           |
| `presetGroups`     | `PresetGroup[] \| Record<string, string[]>` | built-in       | Named preset groups selectable from a dropdown |
| `enableHistory`    | `boolean`                                   | `true`         | Remember recent colors in `localStorage`       |
| `historySize`      | `number`                                    | `10`           | Maximum number of colors kept in history       |
| `width`            | `number`                                    | auto           | Picker width in pixels                         |
| `height`           | `number`                                    | auto           | Color-area height in pixels                    |
| `className`        | `string`                                    | —              | Extra classes on the root (the theming hook)   |

`onChange` and `onChangeComplete` receive a **`ColorValue`** with every format pre-converted (`hex`, `hex8`, `rgb`, `rgba`, `hsl`, `hsla`, `hsv`, `hsva`, `oklab`, `oklch`, `oklcha`), so you never convert manually.

**[Full ColorPicker reference, with live prop demos →](https://www.chromakit.site/docs/color-picker)**

---

## Explore the docs

Everything below has a dedicated page with **live, interactive examples** on the docs site:

- **[Composable Components](https://www.chromakit.site/docs/components)** — build your own picker from `ColorArea`, `HueSlider`, `AlphaSlider`, the input groups, `ColorPreview`, `PresetColors`, `RecentColors`, and more.
- **[Hooks](https://www.chromakit.site/docs/hooks)** — `useColorState`, `usePointerDrag`, `useDebounce`.
- **[Color Utilities](https://www.chromakit.site/docs/utilities)** — ~24 conversion functions plus contrast checkers and harmony generators, with a live converter.
- **[Theming](https://www.chromakit.site/docs/theming)** — reskin the picker by overriding `--ck-*` CSS variables on a class.
- **[Troubleshooting](https://www.chromakit.site/docs/troubleshooting)** — common gotchas and the full list of type exports.

---

## Browser Support

| Environment           | Minimum version |
| --------------------- | --------------- |
| Chrome / Edge         | 88+             |
| Firefox               | 87+             |
| Safari                | 15+             |
| Node.js (SSR / build) | 20+             |

ChromaKit computes OKLCH/OKLAB in JavaScript, so it works even where the CSS `oklch()` syntax isn't yet supported — you only need `oklch()` support in your app if you render the string output.

---

## TypeScript

ChromaKit is written in TypeScript and ships complete declarations. Every public type is importable:

```tsx
import type {
  RGB,
  RGBA,
  HSL,
  HSLA,
  HSV,
  HSVA,
  OKLAB,
  OKLABA,
  OKLCH,
  OKLCHA,
  ColorFormat,
  ColorValue,
  ColorPickerProps,
  PresetGroup,
  PresetGroupsInput,
} from 'chromakit-react';
```

More at **[Troubleshooting → Type exports](https://www.chromakit.site/docs/troubleshooting#type-exports)**.

---

## Resources

- [Documentation](https://www.chromakit.site/docs) — full API with live examples
- [Migration Guide](./MIGRATION.md) — switch from react-colorful / react-color
- [Contributing Guide](./CONTRIBUTING.md) — help improve ChromaKit
- [Changelog](./CHANGELOG.md) — release notes

## Support

- [Issues](https://github.com/garrettsiegel/chromakit/issues) — report bugs
- [Discussions](https://github.com/garrettsiegel/chromakit/discussions) — ask questions
- [Sponsor](https://github.com/sponsors/garrettsiegel) — support development

## License

MIT © [Garrett Siegel](https://github.com/garrettsiegel)

**Color science based on** the [OKLCH specification](https://www.w3.org/TR/css-color-4/#ok-lab) (W3C) and Björn Ottosson's [Oklab research](https://bottosson.github.io/posts/oklab/).

---

<div align="center">

**[chromakit.site](https://www.chromakit.site)** • **[Star on GitHub](https://github.com/garrettsiegel/chromakit)** • **[Try the Live Demo](https://www.chromakit.site)**

</div>
