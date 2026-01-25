# ChromaKit - Modern Color Picker for React

## Overview
ChromaKit is a modern, customizable React color picker NPM package with support for modern color spaces like OKLCH, OKLAB, plus traditional RGB, HSL, HSV, and HEX formats. This project includes:
- The color picker library components with full TypeScript support
- A demo/documentation website showcasing all features

## Recent Changes
- January 25, 2026: Initial development complete
  - Created full color picker library with OKLCH, OKLAB, HSL, HSV, RGB, HEX support
  - Implemented color conversion utilities
  - Built composable UI components (ColorArea, HueSlider, AlphaSlider, inputs)
  - Added theme palettes and preset colors
  - Created demo site showcasing all features
  - Added formats prop filtering for customizable format options
  - Implemented dark mode support

## Project Architecture

### Color Picker Library (`client/src/lib/color-picker/`)

#### Types (`types.ts`)
- `RGB`, `RGBA` - Red, Green, Blue color types
- `HSL`, `HSLA` - Hue, Saturation, Lightness types
- `HSV`, `HSVA` - Hue, Saturation, Value types
- `OKLAB`, `OKLABA` - Perceptually uniform OKLAB color space
- `OKLCH`, `OKLCHA` - Perceptually uniform cylindrical OKLCH format
- `ColorValue` - Complete color representation in all formats
- `ColorFormat` - Union type of all supported format strings
- `ColorPickerProps` - Props for the main ColorPicker component

#### Conversions (`conversions.ts`)
- `parseColor(string)` - Parse any color format string to RGBA
- `rgbaToColorValue(rgba)` - Convert RGBA to full ColorValue with all formats
- `formatColor(colorValue, format)` - Format ColorValue to any string format
- Conversion functions between all color spaces (RGB, HSL, HSV, OKLAB, OKLCH)

#### Hooks (`hooks.ts`)
- `useColorState(initialColor, onChange, onChangeComplete)` - Main color state management hook
- `usePointerDrag(onMove, onStart, onEnd)` - Pointer drag handling for sliders
- `useDebounce(value, delay)` - Debounce utility hook

#### Components (`components/`)
- `ColorPicker` - Full-featured color picker with all options
- `ColorArea` - 2D saturation/value picker area
- `HueSlider` - Horizontal/vertical hue slider
- `AlphaSlider` - Alpha/opacity slider with checkerboard background
- `ColorInputs` - Text input with format dropdown
- `RGBInputs` - Individual R, G, B, A number inputs
- `HSLInputs` - Individual H, S, L, A number inputs
- `HSVInputs` - Individual H, S, V, A number inputs
- `OKLCHInputs` - Individual L, C, H, A number inputs
- `ColorPreview` - Color preview swatch
- `ColorSwatch` - Individual clickable color swatch
- `PresetColors` - Grid of preset color swatches

### Demo Site (`client/src/pages/`)
- `Home.tsx` - Full demo page with:
  - Hero section with feature highlights
  - Interactive demo with full ColorPicker
  - Custom picker builder example
  - Theme palettes (vibrant, pastel, dark, nature, ocean)
  - Usage code examples
  - Output values display showing all color formats

### Key Features
1. **Modern Color Spaces**: OKLCH, OKLAB support for perceptually uniform colors
2. **Traditional Formats**: RGB, RGBA, HSL, HSLA, HSV, HSVA, HEX, HEX8
3. **Composable Components**: Build custom pickers from primitives
4. **Configurable Formats**: Use `formats` prop to control available format options
5. **Theme Palettes**: Pre-built color themes for quick prototyping
6. **TypeScript First**: Full type definitions for all APIs
7. **Accessible**: Keyboard-friendly pointer handling
8. **High Performance**: Optimized updates with minimal re-renders
9. **Dark Mode**: Full dark mode support via class-based switching

## Usage Examples

### Basic Usage
```tsx
import { ColorPicker } from '@chromakit/react';

function App() {
  const [color, setColor] = useState('#6366F1');
  
  return (
    <ColorPicker
      value={color}
      onChange={(colorValue) => setColor(colorValue.hex)}
      showAlpha
      showInputs
    />
  );
}
```

### Custom Components
```tsx
import { ColorArea, HueSlider, useColorState } from '@chromakit/react';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#FF5733');
  
  return (
    <div>
      <ColorArea hsva={hsva} onChange={updateColor} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <p>Selected: {colorValue.hex}</p>
    </div>
  );
}
```

### Color Conversions
```tsx
import { parseColor, rgbaToColorValue, formatColor } from '@chromakit/react';

const rgba = parseColor('#FF5733');
const colorValue = rgbaToColorValue(rgba);

console.log(formatColor(colorValue, 'oklch'));
// oklch(63.4% 0.193 36.2)
```

## Technology Stack
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for development/build
- Shadcn UI components

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Known Limitations
- HSV format inputs convert to HSL internally (HSV is not a CSS format)
- OKLAB inputs are available via text input with OKLCH conversion

## User Preferences
- Dark mode support via class-based switching
- Clean, modern design aesthetic with purple accent color
- Monospace fonts for color values
