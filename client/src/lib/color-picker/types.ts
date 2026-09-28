export interface RGB {
  /** 0-255 */
  r: number;
  /** 0-255 */
  g: number;
  /** 0-255 */
  b: number;
}

export interface RGBA extends RGB {
  /** 0-1 */
  a: number;
}

export interface HSL {
  /** 0-360 */
  h: number;
  /** 0-100 */
  s: number;
  /** 0-100 */
  l: number;
}

export interface HSLA extends HSL {
  /** 0-1 */
  a: number;
}

export interface HSV {
  /** 0-360 */
  h: number;
  /** 0-100 */
  s: number;
  /** 0-100 */
  v: number;
}

export interface HSVA extends HSV {
  /** 0-1 */
  a: number;
}

export interface OKLAB {
  /** 0-1 (Lightness) */
  L: number;
  /** roughly -0.4 to 0.4 */
  a: number;
  /** roughly -0.4 to 0.4 */
  b: number;
}

export interface HWB {
  /** 0-360 (Hue) */
  h: number;
  /** 0-100 (Whiteness) */
  w: number;
  /** 0-100 (Blackness) */
  b: number;
}

export interface LAB {
  /** 0-100 (Lightness, CIE Lab / D50) */
  L: number;
  /** roughly -125 to 125 */
  a: number;
  /** roughly -125 to 125 */
  b: number;
}

export interface LCH {
  /** 0-100 (Lightness, CIE LCH / D50) */
  L: number;
  /** 0-150 (Chroma) */
  C: number;
  /** 0-360 (Hue) */
  h: number;
}

export interface OKLCH {
  /** 0-1 (Lightness) */
  L: number;
  /** 0-0.4 (Chroma) */
  C: number;
  /** 0-360 (Hue) */
  h: number;
}

export interface OKLCHA extends OKLCH {
  /** 0-1 (Alpha) */
  a: number;
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
  | 'oklaba'
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
  oklaba: OKLABA;
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
  /**
   * `compact` (default): a 280px column.
   * `wide`: a 520px side-by-side layout with a preset-group menu.
   */
  layout?: 'compact' | 'wide';
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
  width?: number | string;
  /** Color area height in pixels. When omitted, the area stretches to match the controls. */
  height?: number;
  /** Show copy button for quick color copying */
  showCopyButton?: boolean;
  /**
   * Show the screen color sampler (EyeDropper). The button renders only where
   * the browser supports the API, so this has no effect in Firefox or Safari.
   */
  showEyeDropper?: boolean;
  /** Enable color history (stored in localStorage) */
  enableHistory?: boolean;
  /** Maximum number of colors to keep in history (default 10) */
  historySize?: number;
}
