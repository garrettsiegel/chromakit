# Migrating from react-colorful to ChromaKit

ChromaKit provides a modern alternative to react-colorful with additional features like OKLCH support, better composability, and built-in dark mode. This guide helps you migrate smoothly.

## Quick Comparison

| Feature | react-colorful | ChromaKit |
|---------|----------------|-----------|
| Bundle Size | ~3KB | ~8KB |
| Color Formats | HEX, RGB, HSL, HSV | HEX, RGB, HSL, HSV, **OKLCH, OKLAB** |
| Components | 12+ specialized pickers | Composable primitives + full picker |
| TypeScript | ✅ Included | ✅ Native |
| Dependencies | 0 | 0 |
| Dark Mode | Manual CSS | Built-in |
| Accessibility | Basic | WCAG AA |

## Installation

```bash
# Remove react-colorful
npm uninstall react-colorful

# Install ChromaKit
npm install chromakit-react
```

## Basic Migration

### HEX Color Picker

**Before (react-colorful):**
```tsx
import { HexColorPicker } from "react-colorful";

function App() {
  const [color, setColor] = useState("#aabbcc");
  return <HexColorPicker color={color} onChange={setColor} />;
}
```

**After (ChromaKit):**
```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function App() {
  const [color, setColor] = useState("#aabbcc");
  return (
    <ColorPicker 
      value={color} 
      onChange={(colorValue) => setColor(colorValue.hex)}
      formats={['hex']}
    />
  );
}
```

### RGB Color Picker

**Before (react-colorful):**
```tsx
import { RgbColorPicker } from "react-colorful";

function App() {
  const [color, setColor] = useState({ r: 170, g: 187, b: 204 });
  return <RgbColorPicker color={color} onChange={setColor} />;
}
```

**After (ChromaKit):**
```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function App() {
  const [color, setColor] = useState("rgb(170, 187, 204)");
  
  return (
    <ColorPicker 
      value={color} 
      onChange={(colorValue) => setColor(colorValue.rgb)}
      formats={['rgb']}
    />
  );
}
```

### HSL Color Picker

**Before (react-colorful):**
```tsx
import { HslColorPicker } from "react-colorful";

function App() {
  const [color, setColor] = useState({ h: 200, s: 50, l: 28 });
  return <HslColorPicker color={color} onChange={setColor} />;
}
```

**After (ChromaKit):**
```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function App() {
  const [color, setColor] = useState("hsl(200, 50%, 28%)");
  return (
    <ColorPicker 
      value={color} 
      onChange={(colorValue) => setColor(colorValue.hsl)}
      formats={['hsl']}
    />
  );
}
```

## Format Conversion

ChromaKit uses **string-based color formats** instead of objects. Use the conversion utilities if you need to work with object formats:

```tsx
import { parseColor, formatColor, hexToRgb, rgbToHex } from 'chromakit-react';

// Parse any color string to RGB object
const rgb = parseColor("#aabbcc"); // { r: 170, g: 187, b: 204 }

// Convert between formats
const hex = rgbToHex({ r: 170, g: 187, b: 204 }); // "#aabbcc"
const rgbObj = hexToRgb("#aabbcc"); // { r: 170, g: 187, b: 204 }

// Format color to string
const hslString = formatColor({ h: 200, s: 50, l: 28 }, 'hsl'); // "hsl(200, 50%, 28%)"
```

## Advanced: Composable Components

react-colorful has limited composability. ChromaKit offers full control with primitive components:

**react-colorful approach:**
```tsx
import { HexColorPicker, HexColorInput } from "react-colorful";

<div>
  <HexColorPicker color={color} onChange={setColor} />
  <HexColorInput color={color} onChange={setColor} />
</div>
```

**ChromaKit approach (more flexible):**
```tsx
import { 
  ColorArea, 
  HueSlider, 
  AlphaSlider, 
  ColorPreview,
  useColorState
} from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#aabbcc');
  
  return (
    <div className="custom-picker">
      <ColorPreview colorValue={colorValue} size="lg" />
      <ColorArea hsva={hsva} onChange={updateColor} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
    </div>
  );
}
```

## Styling Differences

### react-colorful
```css
.react-colorful {
  height: 240px;
}
.react-colorful__saturation {
  border-radius: 4px 4px 0 0;
}
```

### ChromaKit
```css
.chromakit-picker {
  height: 240px;
}
.chromakit-color-area {
  border-radius: 4px;
}
```

ChromaKit also supports dark mode automatically:
```tsx
// Wrap your app with dark mode class
<div className="dark">
  <ColorPicker 
    value={color} 
    onChange={(colorValue) => setColor(colorValue.hex)} 
  />
</div>
```

## HexColorInput Equivalent

**Before (react-colorful):**
```tsx
import { HexColorInput } from "react-colorful";

<HexColorInput 
  color={color} 
  onChange={setColor}
  placeholder="Type a color"
  prefixed
  alpha
/>
```

**After (ChromaKit):**
```tsx
import { ColorInputs } from 'chromakit-react';
import { useColorState } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function MyComponent() {
  const { hsva, colorValue, updateColor, setFromString } = useColorState('#aabbcc');
  
  return (
    <ColorInputs
      colorValue={colorValue}
      format="hex"
      onChange={setFromString}
    />
  );
}
```
```

## Popover Pattern

**Before (react-colorful):**
```tsx
import { HexColorPicker } from "react-colorful";

const [isOpen, setIsOpen] = useState(false);

<div className="picker-container">
  <div 
    className="swatch" 
    style={{ backgroundColor: color }}
    onClick={() => setIsOpen(!isOpen)}
  />
  {isOpen && (
    <div className="popover">
      <HexColorPicker color={color} onChange={setColor} />
    </div>
  )}
</div>
```

**After (ChromaKit):**
```tsx
import { ColorPicker, ColorPreview } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

const [isOpen, setIsOpen] = useState(false);

<div className="picker-container">
  <ColorPreview 
    colorValue={{ hex: color }}
    onClick={() => setIsOpen(!isOpen)}
    className="cursor-pointer"
  />
  {isOpen && (
    <div className="popover">
      <ColorPicker 
        value={color} 
        onChange={(colorValue) => setColor(colorValue.hex)} 
      />
    </div>
  )}
</div>
```

Or use the built-in `showPreview` prop:
```tsx
<ColorPicker 
  value={color} 
  onChange={(colorValue) => setColor(colorValue.hex)}
  showPreview={true}
/>
```

## Preset Colors

**Before (react-colorful):**
```tsx
const presets = ["#ff0000", "#00ff00", "#0000ff"];

<div>
  <HexColorPicker color={color} onChange={setColor} />
  <div className="presets">
    {presets.map((preset) => (
      <button
        key={preset}
        onClick={() => setColor(preset)}
      />
    ))}
  </div>
</div>
```

**After (ChromaKit):**
```tsx
const presets = ["#ff0000", "#00ff00", "#0000ff"];

<ColorPicker 
  value={color} 
  onChange={(colorValue) => setColor(colorValue.hex)}
  showPresets={true}
  presets={presets}
/>
```

## Debouncing

**Before (react-colorful):**
```tsx
import { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { debounce } from "lodash"; // External dependency

const [color, setColor] = useState("#aabbcc");

const debouncedSetColor = useCallback(
  debounce((color) => {
    setColor(color);
  }, 200),
  []
);

<HexColorPicker color={color} onChange={debouncedSetColor} />
```

**After (ChromaKit):**
```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

const [color, setColor] = useState("#aabbcc");

// ChromaKit doesn't have built-in debouncing,
// but you can use onChangeComplete for debounced updates:
<ColorPicker 
  value={color} 
  onChange={(colorValue) => {
    // Real-time preview (optional)
  }}
  onChangeComplete={(colorValue) => setColor(colorValue.hex)}
/>
```

## TypeScript Differences

### react-colorful
```tsx
import { HexColorPicker } from "react-colorful";
import type { RgbColor, HslColor } from "react-colorful";
```

### ChromaKit
```tsx
import { ColorPicker } from 'chromakit-react';
import type { ColorValue, ColorFormat } from 'chromakit-react';

// ChromaKit uses ColorValue objects
const handleChange = (colorValue: ColorValue) => {
  console.log(colorValue.hex);     // "#aabbcc"
  console.log(colorValue.rgb);     // "rgb(170, 187, 204)"
  console.log(colorValue.oklch);   // "oklch(0.75 0.05 250)"
};

// ChromaKit uses string-based colors by default
const color: string = "rgb(170, 187, 204)";

// But also exports object types for conversions
const rgbObj: RgbColor = { r: 170, g: 187, b: 204 };
const hslObj: HslColor = { h: 200, s: 50, l: 28 };
```

## Why Migrate?

### Benefits of ChromaKit over react-colorful:

1. **OKLCH/OKLAB Support** - Perceptually uniform color spaces for better gradients and accessibility
2. **More Composable** - Build custom pickers with individual components
3. **Built-in Dark Mode** - No extra CSS needed
4. **Better Accessibility** - WCAG AA compliant with full keyboard navigation
5. **Richer API** - More configuration options and presets
6. **Modern Color Spaces** - Future-proof your color selection

### Tradeoffs:

- **Slightly Larger**: 8KB vs 3KB (still very small)
- **String-based API**: Different from react-colorful's object-based colors
- **Different CSS Classes**: Need to update custom styles

## Need Help?

- 📖 [Full Documentation](https://www.chromakit.site)
- 🐛 [Report Issues](https://github.com/garrettsiegel/chromakit/issues)

## Component Mapping Table

| react-colorful | ChromaKit | Notes |
|---|---|---|
| `HexColorPicker` | `ColorPicker` with `formats={['hex']}` | Full-featured picker |
| `HexAlphaColorPicker` | `ColorPicker` with `formats={['hex8']}` | Alpha included |
| `RgbColorPicker` | `ColorPicker` with `formats={['rgb']}` | ColorValue-based |
| `RgbaColorPicker` | `ColorPicker` with `formats={['rgba']}` | ColorValue-based |
| `HslColorPicker` | `ColorPicker` with `formats={['hsl']}` | ColorValue-based |
| `HslaColorPicker` | `ColorPicker` with `formats={['hsla']}` | ColorValue-based |
| `HsvColorPicker` | `ColorPicker` with `formats={['hsv']}` | ColorValue-based |
| `HsvaColorPicker` | `ColorPicker` with `formats={['hsva']}` | ColorValue-based |
| `HexColorInput` | `ColorInputs` | Use with useColorState hook |
| N/A | `ColorArea` | Composable primitive |
| N/A | `HueSlider` | Composable primitive |
| N/A | `AlphaSlider` | Composable primitive |
| N/A | `ColorPreview` | Built-in component |
| N/A | `ColorPicker` with `formats={['oklch']}` | **Unique to ChromaKit** |
| N/A | `ColorPicker` with `formats={['oklab']}` | **Unique to ChromaKit** |
