# ChromaKit

> **[chromakit.site](https://www.chromakit.site)** - Live demo and documentation

A modern React color picker library with first-class support for perceptually uniform color spaces (OKLCH, OKLAB) alongside traditional formats.

## Features

- **Modern Color Spaces**: OKLCH, OKLAB support for perceptually uniform colors
- **Traditional Formats**: RGB(A), HSL(A), HSV(A), HEX, HEX8
- **Composable**: Build custom pickers with primitive components
- **TypeScript First**: Complete type definitions
- **Dark Mode**: Built-in dark mode support
- **Lightweight**: Minimal dependencies
- **Accessible**: WCAG compliant (keyboard navigation, ARIA labels)

## Installation

```bash
npm install chromakit-react
```

## Quick Start

```tsx
import { ColorPicker } from 'chromakit-react';

function App() {
  const [color, setColor] = useState('#ff0000');

  return (
    <ColorPicker
      color={color}
      onChange={setColor}
      format="hex"
    />
  );
}
```

## API Reference

### ColorPicker

The main color picker component with all features included.

```tsx
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  format?: ColorFormat;
  showFormatToggle?: boolean;
  showAlpha?: boolean;
  showPresets?: boolean;
  presets?: string[];
  className?: string;
}
```

**Props:**

- `color` - Current color value (any supported format)
- `onChange` - Callback when color changes
- `format` - Output format: `'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'`
- `showFormatToggle` - Show format selector dropdown (default: `true`)
- `showAlpha` - Enable alpha channel control (default: `true`)
- `showPresets` - Display color presets (default: `true`)
- `presets` - Custom preset colors array
- `className` - Additional CSS classes

### Composable Components

Build custom pickers using primitive components:

```tsx
import { ColorArea, HueSlider, AlphaSlider, ColorPreview } from 'chromakit-react';

function CustomPicker() {
  const [color, setColor] = useState('#ff0000');

  return (
    <div>
      <ColorArea color={color} onChange={setColor} />
      <HueSlider color={color} onChange={setColor} />
      <AlphaSlider color={color} onChange={setColor} />
      <ColorPreview color={color} />
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
  parseColor
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

| Format | Example | Description |
|--------|---------|-------------|
| HEX | `#ff0000` | Hexadecimal RGB |
| HEX8 | `#ff0000ff` | Hex with alpha |
| RGB | `rgb(255, 0, 0)` | Red, Green, Blue |
| RGBA | `rgba(255, 0, 0, 1)` | RGB with alpha |
| HSL | `hsl(0, 100%, 50%)` | Hue, Saturation, Lightness |
| HSLA | `hsla(0, 100%, 50%, 1)` | HSL with alpha |
| HSV | `hsv(0, 100%, 100%)` | Hue, Saturation, Value |
| OKLCH | `oklch(0.63 0.26 29)` | Perceptually uniform cylindrical |
| OKLAB | `oklab(0.63 0.22 0.13)` | Perceptually uniform Cartesian |

## Examples

### With Format Filtering

```tsx
<ColorPicker
  color={color}
  onChange={setColor}
  format="oklch"
  formats={['oklch', 'hex', 'rgb']}
/>
```

### With Custom Presets

```tsx
<ColorPicker
  color={color}
  onChange={setColor}
  showPresets
  presets={[
    '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#FFA07A', '#98D8C8', '#F7DC6F'
  ]}
/>
```

### Without Alpha Channel

```tsx
<ColorPicker
  color={color}
  onChange={setColor}
  showAlpha={false}
/>
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
  ColorValue
} from 'chromakit-react';
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

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
