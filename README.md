# ChromaKit

[![npm version](https://img.shields.io/npm/v/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![npm downloads](https://img.shields.io/npm/dm/chromakit-react.svg)](https://www.npmjs.com/package/chromakit-react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/chromakit-react)](https://bundlephobia.com/package/chromakit-react)
[![license](https://img.shields.io/npm/l/chromakit-react.svg)](https://github.com/garrettsiegel/chromakit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> **[chromakit.site](https://www.chromakit.site)** - Live demo and documentation

A modern React color picker library with first-class support for perceptually uniform color spaces (OKLCH, OKLAB) alongside traditional formats.

## Why ChromaKit?

ChromaKit offers a **modern alternative** to traditional color pickers with unique advantages:

### 🎨 Modern Color Spaces

Unlike react-colorful and react-color, ChromaKit includes **OKLCH and OKLAB** support—perceptually uniform color spaces that produce visually consistent gradients and better color transformations. Perfect for design systems and accessible color palettes.

### 🧩 Fully Composable

Build exactly the picker you need using primitive components (`ColorArea`, `HueSlider`, `AlphaSlider`). No bloated all-in-one components—just the pieces you want.

### 🌗 Built-in Dark Mode

Automatic dark mode support without extra configuration. Components adapt seamlessly to your theme.

### ⚡ Performance Focused

- **Zero runtime dependencies** (only React peer dependency)
- **Tree-shakeable** exports—only import what you use
- **~10KB gzipped**—slightly larger than react-colorful (3KB) but includes OKLCH/OKLAB + composability
- Built with modern React hooks for 60fps interactions

### ♿ Accessibility First

- WCAG AA compliant with full keyboard navigation
- ARIA labels and roles throughout
- Screen reader tested
- Touch-friendly for mobile devices

### 📘 TypeScript Native

Written in TypeScript from the ground up with complete type definitions for all color formats and components.

### Comparison

| Feature        | ChromaKit   | react-colorful | react-color |
| -------------- | ----------- | -------------- | ----------- |
| Bundle Size    | ~10KB       | ~3KB           | ~28KB       |
| OKLCH/OKLAB    | ✅          | ❌             | ❌          |
| Tree-shakeable | ✅          | ✅             | ❌          |
| TypeScript     | ✅ Native   | ✅             | ⚠️ @types   |
| Composable     | ✅          | Limited        | ❌          |
| Dark Mode      | ✅ Built-in | Manual         | Manual      |
| Dependencies   | 0           | 0              | Many        |

**When to use ChromaKit**: Modern design systems, OKLCH-based palettes, custom picker UIs, accessibility-critical apps

**When to use react-colorful**: Minimal bundle size is paramount and traditional color spaces suffice

**Migrating from react-colorful?** See our [Migration Guide](./MIGRATION.md) for step-by-step instructions and component mapping.

## Features

- **Modern Color Spaces**: OKLCH, OKLAB support for perceptually uniform colors
- **Traditional Formats**: RGB(A), HSL(A), HSV(A), HEX, HEX8
- **Composable**: Build custom pickers with primitive components
- **Eyedropper Tool**: Pick colors from anywhere on screen (modern browsers)
- **Color History**: Automatically saves recent colors to localStorage
- **Copy to Clipboard**: Quick color copying with keyboard shortcuts (Cmd/Ctrl+C)
- **Color Harmony**: Utilities for complementary, analogous, triadic color schemes
- **Contrast Checker**: WCAG AA/AAA contrast ratio calculator
- **TypeScript First**: Complete type definitions
- **Dark Mode**: Built-in dark mode support
- **Lightweight**: ~10KB gzipped with zero runtime dependencies
- **Accessible**: WCAG compliant (keyboard navigation, ARIA labels)

## Installation

```bash
npm install chromakit-react
```

## Quick Start

```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css'; // Import styles

function App() {
  const [color, setColor] = useState('#ff0000');

  return (
    <ColorPicker
      value={color}
      onChange={(colorValue) => setColor(colorValue.hex)}
    />
  );
}
```

### CSS Import Options

ChromaKit styles can be imported in two ways:

**Option 1: Automatic Import** (default)

```tsx
import { ColorPicker } from 'chromakit-react';
// CSS is automatically included (~13KB total: 10KB JS + 3KB CSS)
```

**Option 2: Manual Import** (recommended for tree-shaking)

```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css'; // Explicit CSS import
```

For optimal bundle size with tree-shaking, configure your bundler to treat CSS as a side effect:

```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          chromakit: ['chromakit-react'],
        },
      },
    },
  },
};
```

## API Reference

### ColorPicker

The main color picker component with all features included.

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
  presets?: string[];
  width?: number;
  height?: number;
  showEyeDropper?: boolean;
  showCopyButton?: boolean;
  enableHistory?: boolean;
  historySize?: number;
  className?: string;
}
```

**Props:**

- `value` - Controlled color value (any supported format)
- `defaultValue` - Initial color value for uncontrolled mode (default: `'#6366F1'`)
- `onChange` - Callback fired during color changes (real-time)
- `onChangeComplete` - Callback fired when user completes a change (mouse up, blur)
- `formats` - Available color formats for the picker (default: `['hex', 'rgb', 'hsl', 'oklch']`)
- `showAlpha` - Enable alpha channel control (default: `true`)
- `showInputs` - Show color input fields (default: `true`)
- `showPreview` - Show color preview swatch (default: `true`)
- `presets` - Custom preset colors array
- `width` - Custom width in pixels
- `height` - Custom color area height in pixels
- `showEyeDropper` - Show eyedropper button for screen color picking (default: `true`, requires browser support)
- `showCopyButton` - Show copy button and enable Cmd/Ctrl+C shortcut (default: `true`)
- `enableHistory` - Store recent colors in localStorage (default: `true`)
- `historySize` - Maximum colors to keep in history (default: `10`)
- `className` - Additional CSS classes

### Composable Components

Build custom pickers using primitive components:

```tsx
import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
} from 'chromakit-react';
import { useColorState } from 'chromakit-react';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#ff0000');

  return (
    <div>
      <ColorArea hsva={hsva} onChange={updateColor} width={200} height={150} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
      <ColorPreview colorValue={colorValue} />
    </div>
  );
}
```

### Color Utilities

```tsx
import {
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  parseColor,
} from 'chromakit-react';

// Convert between formats
const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const hex = rgbToHex(rgb); // '#ff0000'

// Parse any format
const parsed = parseColor('oklch(0.7 0.2 30)');
// { format: 'oklch', values: { l: 0.7, c: 0.2, h: 30 } }
```

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

## Examples

### With Format Filtering

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  formats={['oklch', 'hex', 'rgb']}
/>
```

### With Custom Presets

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  showPresets
  presets={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']}
/>
```

### Without Alpha Channel

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  showAlpha={false}
/>
```

### Custom Width & Options

Customize the picker appearance and behavior:

```tsx
// Custom width (default is calculated based on content)
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  width={320}
/>

// Hide specific features
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  showEyeDropper={false}
  showCopyButton={false}
  showPresets={false}
/>
```

### Eyedropper & Copy

Enable advanced features for power users:

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  showEyeDropper={true} // Show eyedropper button (requires browser support)
  showCopyButton={true} // Show copy button + Cmd/Ctrl+C shortcut
/>
```

### Color History

Automatically track recently used colors:

```tsx
<ColorPicker
  value={color}
  onChange={(colorValue) => setColor(colorValue.hex)}
  enableHistory={true} // Store colors in localStorage
  historySize={10} // Keep last 10 colors (default)
/>
```

### Color Harmony Tools

Generate harmonious color schemes:

```tsx
import {
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getTetradicColors,
} from 'chromakit-react';

const baseColor = { r: 255, g: 107, b: 107 };

// Get complementary color (opposite on color wheel)
const complementary = getComplementaryColor(baseColor);

// Get analogous colors (adjacent on color wheel)
const analogous = getAnalogousColors(baseColor, 30); // Returns array of 3 colors

// Get triadic colors (evenly spaced on color wheel)
const triadic = getTriadicColors(baseColor); // Returns array of 3 colors

// Get split-complementary colors
const splitComp = getSplitComplementaryColors(baseColor, 30); // Returns array of 3 colors

// Get tetradic (rectangular) colors
const tetradic = getTetradicColors(baseColor, 60); // Returns array of 4 colors
```

### Contrast Checker

Check WCAG compliance for accessibility:

```tsx
import {
  getContrastRatio,
  meetsContrastRatio,
  getRelativeLuminance,
} from 'chromakit-react';

const textColor = { r: 0, g: 0, b: 0 };
const bgColor = { r: 255, g: 255, b: 255 };

// Calculate contrast ratio
const ratio = getContrastRatio(textColor, bgColor); // Returns 21 (maximum)

// Check WCAG compliance
const meetsAA = meetsContrastRatio(ratio, 'AA', 'normal'); // true (needs 4.5:1)
const meetsAAA = meetsContrastRatio(ratio, 'AAA', 'normal'); // true (needs 7:1)

// Large text has lower requirements
const meetsLargeAA = meetsContrastRatio(3.5, 'AA', 'large'); // true (needs 3:1)
```

### Clipboard Utilities

Programmatically copy colors:

```tsx
import { copyToClipboard } from 'chromakit-react';

const handleCopy = async () => {
  const success = await copyToClipboard('#ff6b6b');
  if (success) {
    console.log('Color copied!');
  }
};
```

### Native Eyedropper

Pick colors from screen (requires modern browser):

```tsx
import { isEyeDropperSupported, pickColorFromScreen } from 'chromakit-react';

if (isEyeDropperSupported()) {
  const handlePick = async () => {
    const color = await pickColorFromScreen();
    if (color) {
      setColor(color); // Returns hex color like "#ff6b6b"
    }
  };
}
```

## Why OKLCH?

OKLCH is a perceptually uniform color space that provides:

- **Predictable Lightness**: Changing lightness affects only perceived brightness
- **Better Gradients**: Smooth transitions without muddy middle tones
- **Wide Gamut**: Access to more vibrant colors on modern displays
- **Human-Friendly**: Parameters match how we perceive color

[Learn more about OKLCH →](https://oklch.com/)

## Browser Support

ChromaKit works in all modern browsers:

- Chrome/Edge 88+
- Firefox 87+
- Safari 15+

For OKLCH color space support in CSS, see [Can I Use: OKLCH](https://caniuse.com/mdn-css_types_color_oklch).

## Styling

ChromaKit uses CSS variables for theming. Override these in your CSS:

```css
:root {
  --chromakit-bg: #ffffff;
  --chromakit-border: #e5e7eb;
  --chromakit-text: #111827;
}

.dark {
  --chromakit-bg: #1f2937;
  --chromakit-border: #374151;
  --chromakit-text: #f9fafb;
}
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  ColorFormat,
  RGBColor,
  HSLColor,
  OKLCHColor,
  ColorValue,
} from 'chromakit-react';
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Support the Project

If ChromaKit has helped you build something awesome, consider supporting its development:

[![Sponsor](https://img.shields.io/badge/sponsor-GitHub-pink?style=for-the-badge&logo=github)](https://github.com/sponsors/garrettsiegel)

Your support helps maintain the project and develop new features.

## Documentation

- 📖 [Migration Guide](./MIGRATION.md) - Migrating from react-colorful
- ⚡ [Performance Benchmarks](./PERFORMANCE.md) - Bundle size, speed, and memory comparisons
- 🤝 [Contributing Guide](./CONTRIBUTING.md) - How to contribute to ChromaKit

## License

MIT © [ChromaKit](LICENSE)

## Credits

Built with:

- [React](https://react.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

Color science based on:

- [OKLCH specification](https://www.w3.org/TR/css-color-4/#ok-lab)
- [Oklab color space](https://bottosson.github.io/posts/oklab/)
