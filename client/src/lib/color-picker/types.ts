export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface RGBA extends RGB {
  a: number; // 0-1
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HSLA extends HSL {
  a: number; // 0-1
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface HSVA extends HSV {
  a: number; // 0-1
}

export interface OKLAB {
  L: number; // 0-1 (Lightness)
  a: number; // roughly -0.4 to 0.4
  b: number; // roughly -0.4 to 0.4
}

export interface OKLCH {
  L: number; // 0-1 (Lightness)
  C: number; // 0-0.4 (Chroma)
  h: number; // 0-360 (Hue)
}

export interface OKLCHA extends OKLCH {
  a: number; // 0-1 (Alpha)
}

export interface OKLABA extends OKLAB {
  alpha: number; // 0-1
}

export type ColorFormat = 
  | 'hex'
  | 'hex8'
  | 'rgb'
  | 'rgba'
  | 'hsl'
  | 'hsla'
  | 'hsv'
  | 'hsva'
  | 'oklab'
  | 'oklch'
  | 'oklcha';

export interface ColorValue {
  hex: string;
  hex8: string;
  rgb: RGB;
  rgba: RGBA;
  hsl: HSL;
  hsla: HSLA;
  hsv: HSV;
  hsva: HSVA;
  oklab: OKLAB;
  oklch: OKLCH;
  oklcha: OKLCHA;
}

export interface ColorTheme {
  id: string;
  name: string;
  colors: string[];
}

export interface ColorPickerTheme {
  background?: string;
  border?: string;
  thumb?: string;
  thumbBorder?: string;
  thumbSize?: number;
  inputBackground?: string;
  inputBorder?: string;
  inputText?: string;
  labelText?: string;
  borderRadius?: number;
}

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: ColorValue) => void;
  onChangeComplete?: (color: ColorValue) => void;
  formats?: ColorFormat[];
  showAlpha?: boolean;
  showInputs?: boolean;
  showPreview?: boolean;
  presets?: string[];
  themes?: ColorTheme[];
  theme?: ColorPickerTheme;
  className?: string;
  width?: number;
  height?: number;
}
