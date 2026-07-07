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
  /**
   * Alpha channel, 0-1. Named `alpha` (not `a`, as on the other *A types)
   * because OKLAB already uses `a` for its green–red axis.
   */
  alpha: number;
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

export interface PresetGroup {
  name: string;
  colors: string[];
}

export type PresetGroupsInput = PresetGroup[] | Record<string, string[]>;

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
  presetGroups?: PresetGroupsInput;
  className?: string;
  /** Show preset color swatches */
  showPresets?: boolean;
  width?: number;
  /** Color area height in pixels. When omitted, the area stretches to match the controls. */
  height?: number;
  /** Show copy button for quick color copying */
  showCopyButton?: boolean;
  /** Enable color history (stored in localStorage) */
  enableHistory?: boolean;
  /** Maximum number of colors to keep in history (default 10) */
  historySize?: number;
}
