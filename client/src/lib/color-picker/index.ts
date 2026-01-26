// Import CSS for bundling (consumers can import this file or the CSS separately)
import './chromakit.css';

// Types
export type {
  RGB,
  RGBA,
  HSL,
  HSLA,
  HSV,
  HSVA,
  OKLAB,
  OKLCH,
  OKLCHA,
  OKLABA,
  ColorFormat,
  ColorValue,
  ColorTheme,
  ColorPickerTheme,
  ColorPickerProps,
} from './types';

// Conversion utilities
export {
  parseHex,
  rgbaToHex,
  rgbaToHex8,
  rgbToHsl,
  rgbaToHsla,
  hslToRgb,
  hslaToRgba,
  rgbToHsv,
  rgbaToHsva,
  hsvToRgb,
  hsvaToRgba,
  rgbToOklab,
  rgbaToOklaba,
  oklabToRgb,
  oklabaToRgba,
  oklabToOklch,
  rgbToOklch,
  rgbaToOklcha,
  oklchToOklab,
  oklchToRgb,
  oklchaToRgba,
  parseColor,
  rgbaToColorValue,
  formatColor,
} from './conversions';

// Hooks
export { useColorState, usePointerDrag, useDebounce } from './hooks';

// Components
export { ColorArea } from './components/ColorArea';
export { HueSlider } from './components/HueSlider';
export { AlphaSlider } from './components/AlphaSlider';
export { ColorInputs, RGBInputs, HSLInputs, HSVInputs, OKLCHInputs } from './components/ColorInputs';
export { ColorPreview, ColorSwatch, PresetColors } from './components/ColorPreview';
export { ColorPicker } from './components/ColorPicker';
export { CopyButton } from './components/CopyButton';
export { EyeDropperButton } from './components/EyeDropperButton';
export { RecentColors } from './components/RecentColors';

// Utility functions
export {
  getRelativeLuminance,
  getContrastRatio,
  meetsContrastRatio,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getTetradicColors,
  getColorHistory,
  addToColorHistory,
  clearColorHistory,
  copyToClipboard,
  isEyeDropperSupported,
  pickColorFromScreen,
} from './utils';
