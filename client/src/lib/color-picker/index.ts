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
  HWB,
  LAB,
  LCH,
  OKLAB,
  OKLCH,
  OKLCHA,
  OKLABA,
  ColorFormat,
  ColorValue,
  PresetGroup,
  PresetGroupsInput,
  ColorPickerProps,
} from './types';

// Conversion utilities
export * from './conversions';

// Hooks
export * from './hooks';

// Components
export { ColorArea } from './components/ColorArea';
export { HueSlider } from './components/HueSlider';
export { AlphaSlider } from './components/AlphaSlider';
export { ColorInputs } from './components/ColorInputs';
export { RGBInputs } from './components/RGBInputs';
export { HSLInputs } from './components/HSLInputs';
export { HSVInputs } from './components/HSVInputs';
export { OKLCHInputs } from './components/OKLCHInputs';
export { OKLABInputs } from './components/OKLABInputs';
export { EyeDropperButton } from './components/EyeDropperButton';
export { ColorPreview } from './components/ColorPreview';
export { ColorSwatch } from './components/ColorSwatch';
export { PresetColors } from './components/PresetColors';
export { ColorPicker } from './components/ColorPicker';
export { CopyButton } from './components/CopyButton';
export { RecentColors } from './components/RecentColors';

// Utility functions
export * from './utils';
