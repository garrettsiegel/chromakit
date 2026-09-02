// Side-effect import so the site build and Vite lib build pick up the stylesheet.
// The published JS does not import CSS; consumers import
// `chromakit-react/chromakit.css` themselves (see `sideEffects` in package.json).
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
export type { ColorAreaProps } from './components/ColorArea';
export { HueSlider } from './components/HueSlider';
export type { HueSliderProps } from './components/HueSlider';
export { AlphaSlider } from './components/AlphaSlider';
export type { AlphaSliderProps } from './components/AlphaSlider';
export { ColorInputs } from './components/ColorInputs';
export type { ColorInputsProps } from './components/ColorInputs';
export { RGBInputs } from './components/RGBInputs';
export { HSLInputs } from './components/HSLInputs';
export { HSVInputs } from './components/HSVInputs';
export { OKLCHInputs } from './components/OKLCHInputs';
export { OKLABInputs } from './components/OKLABInputs';
export { EyeDropperButton } from './components/EyeDropperButton';
export type { EyeDropperButtonProps } from './components/EyeDropperButton';
export { ColorPreview } from './components/ColorPreview';
export type { ColorPreviewProps } from './components/ColorPreview';
export { ColorSwatch } from './components/ColorSwatch';
export type { ColorSwatchProps } from './components/ColorSwatch';
export { PresetColors } from './components/PresetColors';
export type { PresetColorsProps } from './components/PresetColors';
export { ColorPicker } from './components/ColorPicker';
export { CopyButton } from './components/CopyButton';
export type { CopyButtonProps } from './components/CopyButton';
export { RecentColors } from './components/RecentColors';
export type { RecentColorsProps } from './components/RecentColors';
export type { ChannelEditorProps } from './components/create-channel-editor';
export type { ChannelInputsProps } from './components/ChannelInputs';

// Utility functions
export * from './utils';
