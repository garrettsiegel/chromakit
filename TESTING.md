# Testing Instructions

## ✅ Build Complete!

**Package:** chromakit-react v0.1.7  
**Status:** npm link created successfully

## 📦 Bundle Sizes (Verified)

- **ES Module:** 10.32 KB gzipped
- **UMD:** 9.14 KB gzipped
- **CSS:** 2.90 KB gzipped
- **Total:** ~13 KB gzipped

## 🔗 Link to Your Test Project

1. Navigate to your test project:

   ```bash
   cd /path/to/your/test-project
   ```

2. Link chromakit-react:

   ```bash
   npm link chromakit-react
   ```

3. Import in your test app:

   ```tsx
   import { ColorPicker } from 'chromakit-react';
   import 'chromakit-react/chromakit.css';

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

## ✨ What Changed

### Fixed Specifications:

- ✅ Bundle size updated: 8KB → 10KB (accurate)
- ✅ Removed non-existent `size` prop from docs
- ✅ Fixed Quick Start example to use `value` instead of `color`
- ✅ Updated composable components example with correct props
- ✅ Removed "Size Variants" from features list
- ✅ Social proof badges updated to be factual

### Available Components:

- `ColorPicker` - Full-featured color picker
- `ColorArea` - 2D saturation/lightness picker
- `HueSlider` - Hue selection slider
- `AlphaSlider` - Alpha/opacity slider
- `ColorPreview` - Color swatch preview
- `ColorInputs` - Text input fields for colors
- `useColorState` - Hook for managing color state

### Supported Formats:

- HEX, HEX8
- RGB, RGBA
- HSL, HSLA
- HSV, HSVA
- OKLAB, OKLCH, OKLCHA ✨

## 🧪 Testing Checklist

- [ ] Import works correctly
- [ ] CSS styles load properly
- [ ] ColorPicker renders
- [ ] Color changes trigger onChange
- [ ] OKLCH colors work
- [ ] Eyedropper works (modern browsers)
- [ ] Copy button works
- [ ] Keyboard navigation works
- [ ] Dark mode toggles correctly

## 🔄 Unlink When Done

```bash
cd /path/to/your/test-project
npm unlink chromakit-react

cd /Users/garrett/Desktop/chromakit
npm unlink
```

---

**Ready to test!** All claims in homepage and README are now accurate.
