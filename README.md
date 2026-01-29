<div align="center">

# ChromaKit

### The Modern React Color Picker with Perceptually Uniform Colors

**Build better design systems with OKLCH color space support**

[![npm version](https://img.shields.io/npm/v/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![npm downloads](https://img.shields.io/npm/dm/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/chromakit-react)](https://bundlephobia.com/package/chromakit-react)
[![license](https://img.shields.io/npm/l/chromakit-react.svg)](https://github.com/garrettsiegel/chromakit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

[**Live Demo**](https://www.chromakit.site) • [**Documentation**](https://www.chromakit.site) • [**Migration Guide**](./MIGRATION.md)

---

```bash
npm install chromakit-react
```

<br />

**[See it in action →](https://www.chromakit.site)**

<br />

<img src="./og-image.png" alt="ChromaKit - Modern React color picker with OKLCH support" width="100%" />

</div>

<br />

## Table of Contents

- [Why ChromaKit](#why-developers-choose-chromakit)
- [Quick Start](#quick-start)
- [Why OKLCH?](#why-oklch)
- [Features](#features)
- [Framework Setup](#framework-setup)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Color Utilities](#color-utilities)
- [Theming](#theming--customization)
- [Browser Support](#browser-support)
- [TypeScript](#typescript)
- [Troubleshooting](#troubleshooting)

---

## Why Developers Choose ChromaKit

**The only React color picker built for modern design systems.** While other pickers struggle with consistent color scales and muddy gradients, ChromaKit uses perceptually uniform color spaces (OKLCH, OKLAB) to deliver what designers expect and users see.

```tsx
// Get started in 30 seconds
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

<ColorPicker onChange={(color) => console.log(color.oklch)} />;
```

### Perfect For

- **Design System Engineers** - Generate consistent tonal scales with predictable lightness
- **Accessibility Teams** - Built-in WCAG AA/AAA contrast checking
- **App Developers** - Zero dependencies, 10KB bundle, works everywhere
- **UI Libraries** - Composable primitives, full TypeScript support

## What Makes ChromaKit Different

### Perceptually Uniform Colors

**The Problem:** Traditional RGB/HSL create inconsistent color scales. A 10% lightness change in blue looks different than in yellow. Your carefully crafted design system falls apart.

**ChromaKit's Solution:** OKLCH color space ensures equal numerical changes produce equal visual differences. Generate accessible color palettes that _actually look_ evenly spaced.

```tsx
// Generate a perfectly uniform color scale
const scale = Array.from({ length: 9 }, (_, i) => {
  const lightness = 0.2 + i * 0.1; // 20% to 100%
  return `oklch(${lightness} 0.15 250)`; // Consistently spaced blues
});
```

### Composable Architecture

Unlike monolithic pickers, ChromaKit gives you building blocks:

```tsx
import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  useColorState,
} from 'chromakit-react';

// Build your perfect picker layout
function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#6366F1');
  return (
    <>
      <ColorArea hsva={hsva} onChange={updateColor} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
    </>
  );
}
```

### Built for Performance

- **10KB gzipped** - Competitive with alternatives, but includes OKLCH + composability
- **Zero dependencies** - No supply chain risk, no version conflicts
- **Tree-shakeable** - Import only what you use
- **60fps interactions** - Smooth dragging on all devices

### Accessibility Baked In

- **WCAG AA compliant** - Full keyboard navigation, proper ARIA labels
- **Contrast checker included** - `getContrastRatio()`, `meetsContrastRatio()`
- **Screen reader tested** - Works with NVDA, JAWS, VoiceOver
- **Touch-friendly** - 44px minimum touch targets

### TypeScript Excellence

Every color format, every component prop, every utility function - fully typed:

```tsx
import type { ColorValue, OKLCHColor, RGBColor } from 'chromakit-react';

const handleChange = (value: ColorValue) => {
  value.oklch; // { l: number, c: number, h: number }
  value.rgb; // { r: number, g: number, b: number }
  value.hex; // string
};
```

### Comparison

| Feature        | ChromaKit   | react-colorful | react-color |
| -------------- | ----------- | -------------- | ----------- |
| Bundle Size    | ~10KB       | ~3KB           | ~28KB       |
| OKLCH/OKLAB    | ✅          | ❌             | ❌          |
| Composable     | ✅          | Limited        | ❌          |
| TypeScript     | ✅ Native   | ✅             | ⚠️ @types   |
| Dark Mode      | ✅ Built-in | Manual         | Manual      |
| Dependencies   | 0           | 0              | Many        |

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

That's it! You now have a fully-featured color picker with OKLCH support, eyedropper, color history, and more.

---

## Why OKLCH?

OKLCH is a perceptually uniform color space - equal numerical changes produce equal visual differences.

**Key Benefits:**
- **Predictable Lightness**: `oklch(0.5 ...)` appears equally bright regardless of hue, unlike HSL
- **Better Gradients**: Smooth transitions without muddy middle tones
- **Design Systems**: Generate consistent tonal scales with uniform visual weight
- **Wide Gamut**: Access more vibrant colors on modern displays

**Parameters:**
- **L (Lightness)**: 0 (black) to 1 (white)
- **C (Chroma)**: 0 (grayscale) to ~0.4 (vibrant)
- **H (Hue)**: 0-360° around the color wheel

```tsx
// HSL: Same lightness value, different perceived brightness
hsl(240, 100%, 50%) // Blue - looks dark
hsl(60, 100%, 50%)  // Yellow - looks bright

// OKLCH: Same lightness = same perceived brightness
oklch(0.5 0.2 240)  // Blue at 50% brightness
oklch(0.5 0.2 60)   // Yellow at 50% brightness
```

[Learn more about OKLCH →](https://oklch.com/)

---

## Framework Setup

### Next.js App Router

```tsx
'use client';
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

export function MyColorPicker() {
  const [color, setColor] = useState('#6366F1');
  return <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />;
}
```

### Next.js Pages Router (SSR)

```tsx
import dynamic from 'next/dynamic';

const ColorPicker = dynamic(
  () => import('chromakit-react').then((mod) => mod.ColorPicker),
  { ssr: false }
);
```

### Vite / CRA

```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';
// Works out of the box
```

---

## API Reference

### ColorPicker

Full-featured color picker component.

```tsx
interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: ColorValue) => void;
  onChangeComplete?: (color: ColorValue) => void;
  formats?: ColorFormat[];
  showAlpha?: boolean;
  showInputs?: boolean;
  showPreview?: boolean;
  showCopyButton?: boolean;
  showEyeDropper?: boolean;
  showPresets?: boolean;
  presets?: string[];
  presetGroups?: PresetGroup[] | Record<string, string[]>;
  enableHistory?: boolean;
  width?: number;
  height?: number;
  className?: string;
}
```

**Props:**

| Prop               | Type                                          | Default                          | Description                                         |
| ------------------ | --------------------------------------------- | -------------------------------- | --------------------------------------------------- |
| `value`            | `string`                                      | -                                | Controlled color value (any supported format)       |
| `defaultValue`     | `string`                                      | `'#6366F1'`                      | Initial color for uncontrolled mode                 |
| `onChange`         | `(color: ColorValue) => void`                 | -                                | Fires during color changes (real-time)              |
| `onChangeComplete` | `(color: ColorValue) => void`                 | -                                | Fires when user completes a change (mouse up, blur) |
| `formats`          | `ColorFormat[]`                               | `['hex', 'rgb', 'hsl', 'oklch']` | Available color format options                      |
| `showAlpha`        | `boolean`                                     | `true`                           | Enable alpha channel controlha channel control      |
| `showInputs`       | `boolean`                                     | `true`                           | Show color input fields                             |
| `showPreview`      | `boolean`                                     | `true`                           | Show color preview swatch                           |
| `showCopyButton`   | `boolean`                                     | `true`                           | Show copy button (enables Cmd/Ctrl+C)               |
| `showEyeDropper`   | `boolean`                                     | `true`                           | Show eyedropper button (if browser supports)        |
| `showPresets`      | `boolean`                                     | `true`                           | Show preset colors section                          |
| `presets`          | `string[]`                                    | Built-in defaults                | Custom preset colors array                          |
| `presetGroups`     | `PresetGroup[]` or `Record<string, string[]>` | Built-in groups                  | Preset color groups with dropdown                   |
| `enableHistory`    | `boolean`                                     | `true`                           | Store recent colors in localStorage                 |
| `width`            | `number`                                      | auto                             | Custom picker width in pixels                       |
| `height`           | `number`                                      | `100`                            | Color area height in pixels                         |
| `className`        | `string`                                      | -                                | Additional CSS classes                              |

**ColorValue Object:**

The `onChange` and `onChangeComplete` callbacks receive a `ColorValue` object:

```tsx
interface ColorValue {
  hex: string; // "#ff6b6b"
  hex8: string; // "#ff6b6bff"
  rgb: RGBColor; // { r: 255, g: 107, b: 107 }
  rgba: RGBAColor; // { r: 255, g: 107, b: 107, a: 1 }
  hsl: HSLColor; // { h: 0, s: 100, l: 71 }
  hsla: HSLAColor; // { h: 0, s: 100, l: 71, a: 1 }
  hsv: HSVColor; // { h: 0, s: 58, v: 100 }
  hsva: HSVAColor; // { h: 0, s: 58, v: 100, a: 1 }
  oklch: OKLCHColor; // { l: 0.71, c: 0.19, h: 25 }
  oklcha: OKLCHAColor; // { l: 0.71, c: 0.19, h: 25, a: 1 }
  oklab: OKLABColor; // { l: 0.71, a: 0.17, b: 0.08 }
  oklaba: OKLABAColor; // { l: 0.71, a: 0.17, b: 0.08, alpha: 1 }
}
```

### Composable Components

Build custom pickers using primitive components for complete layout control:

```tsx
import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
  ColorInputs,
  useColorState,
} from 'chromakit-react';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#ff0000');

  return (
    <div className="custom-picker">
      <ColorArea hsva={hsva} onChange={updateColor} width={200} height={150} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
      <ColorPreview colorValue={colorValue} size="lg" />
      <ColorInputs
        colorValue={colorValue}
        onChange={(hex) => updateColor(parseColor(hex))}
        format="hex"
      />
    </div>
  );
}
```

**Component Props:**

<details>
<summary><strong>ColorArea</strong> - 2D saturation/lightness picker</summary>

```tsx
interface ColorAreaProps {
  hsva: HSVAColor;
  onChange: (hsva: HSVAColor) => void;
  onStart?: () => void;
  onEnd?: () => void;
  width?: number; // Default: 256
  height?: number; // Default: 200
  className?: string;
}
```

</details>

<details>
<summary><strong>HueSlider</strong> - Hue selection slider</summary>

```tsx
interface HueSliderProps {
  hsva: HSVAColor;
  onChange: (hsva: HSVAColor) => void;
  onStart?: () => void;
  onEnd?: () => void;
  vertical?: boolean; // Default: false
  className?: string;
}
```

</details>

<details>
<summary><strong>AlphaSlider</strong> - Alpha/transparency slider</summary>

```tsx
interface AlphaSliderProps {
  hsva: HSVAColor;
  onChange: (hsva: HSVAColor) => void;
  onStart?: () => void;
  onEnd?: () => void;
  vertical?: boolean; // Default: false
  className?: string;
}
```

</details>

<details>
<summary><strong>ColorPreview</strong> - Color swatch with comparison</summary>

```tsx
interface ColorPreviewProps {
  colorValue: ColorValue;
  showComparison?: boolean; // Show before/after
  originalColor?: string; // Original color for comparison
  size?: 'sm' | 'md' | 'lg'; // Default: 'md'
  className?: string;
}
```

</details>

<details>
<summary><strong>ColorInputs</strong> - Format-switchable input fields</summary>

```tsx
interface ColorInputsProps {
  colorValue: ColorValue;
  onChange: (hexColor: string) => void;
  format: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  showAlpha?: boolean;
  availableFormats?: ColorFormat[];
  className?: string;
}
```

</details>

<details>
<summary><strong>ColorSwatch</strong> - Individual color button</summary>

```tsx
interface ColorSwatchProps {
  color: string;
  onClick?: () => void;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

</details>

<details>
<summary><strong>RecentColors</strong> - Color history display</summary>

```tsx
interface RecentColorsProps {
  onColorSelect?: (color: string) => void;
  maxColors?: number; // Default: 10
  className?: string;
}
```

</details>

### Hooks

**useColorState** - Main color state management hook

```tsx
function useColorState(initialColor?: string) {
  return {
    hsva: HSVAColor;           // Internal HSVA representation
    colorValue: ColorValue;     // All format conversions
    updateColor: (hsva: HSVAColor) => void;
    setColorFromString: (color: string) => void;
  };
}
```

**useDrag** - Drag interaction handler (for custom components)

```tsx
function useDrag(
  ref: RefObject<HTMLElement>,
  onDrag: (x: number, y: number) => void,
  onStart?: () => void,
  onEnd?: () => void
): void;
```

---

## Examples

### Basic Usage

**Simple controlled picker**

```tsx
const [color, setColor] = useState('#6366F1');

<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
/>;
```

### Preset Colors

**Custom preset colors**

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  presets={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']}
/>
```

**Preset groups with dropdown** (New in v0.1.10)

```tsx
const presetGroups = [
  {
    name: 'Material',
    colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'],
  },
  {
    name: 'Tailwind',
    colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'],
  },
];

<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  presetGroups={presetGroups}
/>;
```

Or use object format:

```tsx
const presetGroups = {
  Material: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'],
  Tailwind: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'],
};

<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  presetGroups={presetGroups}
/>;
```

### Format Control

**Limit available formats**

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  formats={['oklch', 'hex', 'rgb']}
/>
```

### Advanced Features

**Track color changes completion**

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => {
    // Fires during dragging (real-time updates)
    setColor(colorValue.hex);
  }}
  onChangeComplete={(colorValue) => {
    // Fires when user finishes selecting (mouse up, blur)
    // Perfect for API calls or expensive operations
    saveColorToDatabase(colorValue.hex);
  }}
/>
```

**Color history with localStorage**

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  enableHistory={true} // Automatically saves recent colors
/>
```

**Access all color formats**

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => {
    console.log(colorValue.hex); // "#ff6b6b"
    console.log(colorValue.rgb); // { r: 255, g: 107, b: 107 }
    console.log(colorValue.oklch); // { l: 0.71, c: 0.19, h: 25 }
    setColor(colorValue.hex);
  }}
/>
```

### Eyedropper & Copy Features

**Built-in eyedropper and copy buttons**

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  showEyeDropper={true} // Shows eyedropper button (if browser supports)
  showCopyButton={true} // Shows copy button + enables Cmd/Ctrl+C
/>
```

Note: The EyeDropper API requires a secure context (HTTPS) and is currently supported in Chrome/Edge 95+, not yet in Firefox or Safari.

### Form Integration

**React Hook Form**

```tsx
import { Controller, useForm } from 'react-hook-form';
import { ColorPicker } from 'chromakit-react';

function MyForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { brandColor: '#6366F1' }
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <Controller
        name="brandColor"
        control={control}
        render={({ field }) => (
          <ColorPicker
            value={field.value}
            onChange={(c) => field.onChange(c.hex)}
          />
        )}
      />
    </form>
  );
}
```

**Formik**

```tsx
import { useFormik } from 'formik';
import { ColorPicker } from 'chromakit-react';

function MyForm() {
  const formik = useFormik({
    initialValues: { brandColor: '#6366F1' },
    onSubmit: values => console.log(values)
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ColorPicker
        value={formik.values.brandColor}
        onChange={(c) => formik.setFieldValue('brandColor', c.hex)}
      />
    </form>
  );
}
```

## Color Utilities

### Conversion Functions

Convert between any color format:

```tsx
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  parseColor,
  colorValueToString,
} from 'chromakit-react';

// Parse any format
const parsed = parseColor('#ff6b6b');
// Returns: { r: 255, g: 107, b: 107, a: 1 }

// Convert between formats
const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const hex = rgbToHex(rgb); // '#ff0000'
const hsl = rgbToHsl(rgb); // { h: 0, s: 100, l: 50 }
const oklch = rgbToOklch(rgb); // { l: 0.63, c: 0.26, h: 29 }

// Format color value to string
const color = { r: 255, g: 107, b: 107, a: 1 };
const hexString = colorValueToString(color, 'hex'); // "#ff6b6b"
const rgbString = colorValueToString(color, 'rgb'); // "rgb(255, 107, 107)"
const oklchString = colorValueToString(color, 'oklch'); // "oklch(0.71 0.19 25)"
```

**Available conversion functions:**

- `hexToRgba(hex)` - Parse hex to RGBA
- `parseColor(color)` - Parse any format to RGBA
- `rgbToHex(rgb)` - RGB to 6-digit hex
- `rgbaToHex8(rgba)` - RGBA to 8-digit hex
- `rgbToHsl(rgb)` / `hslToRgb(hsl)`
- `rgbaToHsla(rgba)` / `hslaToRgba(hsla)`
- `rgbToHsv(rgb)` / `hsvToRgb(hsv)`
- `rgbaToHsva(rgba)` / `hsvaToRgba(hsva)`
- `rgbToOklab(rgb)` / `oklabToRgb(oklab)`
- `rgbaToOklaba(rgba)` / `oklabaToRgba(oklaba)`
- `rgbToOklch(rgb)` / `oklchToRgb(oklch)`
- `rgbaToOklcha(rgba)` / `oklchaToRgba(oklcha)`
- `oklabToOklch(oklab)` / `oklchToOklab(oklch)`
- `rgbaToColorValue(rgba)` - Convert to all formats
- `colorValueToString(colorValue, format)` - Format to string

### Color Formats

ChromaKit supports the following color formats:

| Format | Example                   | Description                      |
| ------ | ------------------------- | -------------------------------- |
| HEX    | `#ff0000`                 | Hexadecimal RGB                  |
| HEX8   | `#ff0000ff`               | Hex with alpha                   |
| RGB    | `rgb(255, 0, 0)`          | Red, Green, Blue                 |
| RGBA   | `rgba(255, 0, 0, 1)`      | RGB with alpha                   |
| HSL    | `hsl(0, 100%, 50%)`       | Hue, Saturation, Lightness       |
| HSLA   | `hsla(0, 100%, 50%, 1)`   | HSL with alpha                   |
| HSV    | `hsv(0, 100%, 100%)`      | Hue, Saturation, Value           |
| HSVA   | `hsva(0, 100%, 100%, 1)`  | HSV with alpha                   |
| OKLCH  | `oklch(0.63 0.26 29)`     | Perceptually uniform cylindrical |
| OKLCHA | `oklch(0.63 0.26 29 / 1)` | OKLCH with alpha                 |
| OKLAB  | `oklab(0.63 0.22 0.13)`   | Perceptually uniform Cartesian   |

## Theming & Customization

Override CSS variables for custom themes:

```css
.my-custom-picker {
  --ck-primary: #9333ea;
  --ck-bg: #0a0a0b;
  --ck-text: #ffffff;
  --ck-radius: 8px;
}
```

```tsx
<ColorPicker className="my-custom-picker" />
```

See [source CSS](./client/src/lib/color-picker/chromakit.css) for all available variables.

## Browser Support

ChromaKit works in all modern browsers:

- **Chrome/Edge**: 88+
- **Firefox**: 87+
- **Safari**: 15+
- **Node.js**: 20+ (for SSR/build tools)

### Feature Support

| Feature                  | Browser Support                         | Fallback                    |
| ------------------------ | --------------------------------------- | --------------------------- |
| Color Picker             | All modern browsers                     | -                           |
| OKLCH/OKLAB calculations | All modern browsers                     | -                           |
| CSS `oklch()` syntax     | Chrome 111+, Firefox 113+, Safari 15.4+ | Use hex/rgb output          |
| EyeDropper API           | Chrome/Edge 95+                         | Button hidden automatically |
| Clipboard API            | All modern browsers (HTTPS required)    | Manual copy                 |

For CSS OKLCH color space support, see [Can I Use: OKLCH](https://caniuse.com/mdn-css_types_color_oklch).



## TypeScript

ChromaKit is written in TypeScript and provides complete type definitions for all exports.

### Type Exports

```tsx
import type {
  // Color format types
  RGBColor,
  RGBAColor,
  HSLColor,
  HSLAColor,
  HSVColor,
  HSVAColor,
  OKLCHColor,
  OKLCHAColor,
  OKLABColor,
  OKLABAColor,

  // Utility types
  ColorFormat,
  ColorValue,
  AnyColor,

  // Component props
  ColorPickerProps,
  ColorAreaProps,
  HueSliderProps,
  AlphaSliderProps,

  // Preset types
  PresetGroup,
  PresetGroupsInput,
} from 'chromakit-react';
```

### Type-Safe Color Conversions

```tsx
import {
  rgbToHsl,
  hslToRgb,
  type RGBColor,
  type HSLColor,
} from 'chromakit-react';

const rgb: RGBColor = { r: 255, g: 107, b: 107 };
const hsl: HSLColor = rgbToHsl(rgb);
// Type: { h: number; s: number; l: number }

const backToRgb: RGBColor = hslToRgb(hsl);
// Fully typed with autocomplete
```

## Troubleshooting

### Common Issues

**Issue: Styles not loading**

Make sure to import the CSS file:

```tsx
import 'chromakit-react/chromakit.css';
```

Or if using automatic imports, ensure your bundler processes CSS side effects.

---

**Issue: Eyedropper not showing**

The EyeDropper API requires:

- Secure context (HTTPS in production, localhost in development)
- Browser support (Chrome/Edge 95+)
- User permission

Check browser support:

```tsx
if ('EyeDropper' in window) {
  // Eyedropper available
}
```

---

**Issue: TypeScript errors with color formats**

Ensure you're using the correct types:

```tsx
import type { ColorValue } from 'chromakit-react';

const handleChange = (colorValue: ColorValue) => {
  // colorValue has all format properties
  console.log(colorValue.hex);
  console.log(colorValue.oklch);
};
```

---

**Issue: Next.js "window is not defined" error**

For server-side rendering, use dynamic imports:

```tsx
import dynamic from 'next/dynamic';

const ColorPicker = dynamic(
  () => import('chromakit-react').then((mod) => mod.ColorPicker),
  { ssr: false }
);
```

---

**Issue: Color history not persisting**

History uses localStorage with key `chromakit-color-history`. Ensure:

- localStorage is available (not in incognito/private mode)
- `enableHistory` prop is `true` (default)
- Browser has storage permissions

Clear history manually:

```tsx
import { clearColorHistory } from 'chromakit-react';
clearColorHistory();
```

---

\*\*I## Resources

- [Migration Guide](./MIGRATION.md) - Switch from react-colorful/react-color
- [Performance Benchmarks](./PERFORMANCE.md) - Bundle size & speed comparisons  
- [Contributing Guide](./CONTRIBUTING.md) - Help improve ChromaKit
- [Changelog](./CHANGELOG.md) - Release notes

## Support

- [Issues](https://github.com/garrettsiegel/chromakit/issues) - Report bugs
- [Discussions](https://github.com/garrettsiegel/chromakit/discussions) - Ask questions
- [Sponsor](https://github.com/sponsors/garrettsiegel) - Support development

## License

MIT © [Garrett Siegel](https://github.com/garrettsiegel)

## Credits

**Built with:**

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool

### [chromakit.site](https://www.chromakit.site)

**[Star on GitHub](https://github.com/garrettsiegel/chromakit)** • **[Try Live Demo](https://www.chromakit.site)** • **[Report Bug](https://github.com/garrettsiegel/chromakit/issues)**
**Color science based on:**

- [OKLCH specification](https://www.w3.org/TR/css-color-4/#ok-lab) - W3C standard
- [Oklab color space](https://bottosson.github.io/posts/oklab/) - Björn Ottosson's research

**Design inspired by:**

- [Radix UI](https://www.radix-ui.com/) - Component patterns
- [Tailwind CSS](https://tailwindcss.com/) - Color palettes

---

<div align="center">

**[chromakit.site](https://www.chromakit.site)**

</div>
```
