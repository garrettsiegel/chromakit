# ✅ Correct ChromaKit Usage

## Your Test Project - Correct Implementation

Your App.tsx should look like this:

```tsx
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';
import { useState } from 'react';

function App() {
  const [color, setColor] = useState<string>('#ff0000');

  return (
    <div>
      <h1>Vite + React</h1>
      <ColorPicker
        value={color}
        onChange={(colorValue) => setColor(colorValue.hex)}
        showEyeDropper={true}
        showCopyButton={true}
        showPresets={true}
      />
    </div>
  );
}

export default App;
```

## Key Points

### ✅ CORRECT Props:

- `value` (not `color`)
- `onChange={(colorValue) => setColor(colorValue.hex)}`
- ColorValue object has: `hex`, `hex8`, `rgb`, `rgba`, `hsl`, `hsla`, `hsv`, `hsva`, `oklab`, `oklch`, `oklcha`

### ❌ WRONG (Don't use):

- `color` prop - doesn't exist
- `onChange={setColor}` - wrong, needs callback that extracts `.hex`
- `size` prop - doesn't exist

## Available Props

```typescript
interface ColorPickerProps {
  value?: string; // Current color (any format)
  defaultValue?: string; // Initial color (default: '#6366F1')
  onChange?: (color: ColorValue) => void;
  onChangeComplete?: (color: ColorValue) => void;
  formats?: ColorFormat[]; // default: ['hex', 'rgb', 'hsl', 'oklch']
  showAlpha?: boolean; // default: true
  showInputs?: boolean; // default: true
  showPreview?: boolean; // default: true
  presets?: string[]; // Custom preset colors
  className?: string;
  width?: number; // Custom width in pixels
  height?: number; // Custom area height
  showEyeDropper?: boolean; // default: true
  showCopyButton?: boolean; // default: true
  showPresets?: boolean; // default: true
  enableHistory?: boolean; // default: true
  historySize?: number; // default: 10
}
```

## Composable Components

If using composable components, use `useColorState` hook:

```tsx
import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
  useColorState,
} from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#ff6b35');

  return (
    <div>
      <ColorArea hsva={hsva} onChange={updateColor} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
      <ColorPreview colorValue={colorValue} />
      <p>Current: {colorValue.hex}</p>
    </div>
  );
}
```

## Changes Made

### Homepage Examples Fixed:

1. ✅ Basic Usage - changed `color` to `value`, added CSS import
2. ✅ Custom Components - added `useColorState` hook, fixed props
3. ✅ Advanced Options - replaced fake "size" variants with real options
4. ✅ Migration CTA - fixed `color` to `value`, added CSS import

### Build Output:

- ES Module: 10.39 KB gzipped
- UMD: 9.19 KB gzipped
- CSS: 2.94 KB gzipped
- Total: ~13 KB gzipped

---

All examples are now accurate and match the actual API! 🎉
