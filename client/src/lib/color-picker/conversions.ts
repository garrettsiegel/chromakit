import type { RGB, RGBA, HSL, HSLA, HSV, HSVA, OKLAB, OKLCH, OKLCHA, OKLABA, ColorValue } from './types';

// Clamp utility
const clamp = (value: number, min: number, max: number): number => 
  Math.max(min, Math.min(max, value));

// Round to precision
const round = (value: number, precision: number = 2): number => 
  Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

// HEX parsing and formatting
export function parseHex(hex: string): RGBA | null {
  const cleaned = hex.replace('#', '');
  
  // Validate hex string contains only valid hex characters
  if (!/^[0-9A-Fa-f]+$/.test(cleaned)) {
    return null;
  }
  
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b, a: 1 };
  }
  
  if (cleaned.length === 4) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    const a = parseInt(cleaned[3] + cleaned[3], 16) / 255;
    return { r, g, b, a };
  }
  
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }
  
  if (cleaned.length === 8) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    const a = parseInt(cleaned.slice(6, 8), 16) / 255;
    return { r, g, b, a };
  }
  
  return null;
}

export function rgbaToHex(rgba: RGBA): string {
  const r = Math.round(rgba.r).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function rgbaToHex8(rgba: RGBA): string {
  const r = Math.round(rgba.r).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b).toString(16).padStart(2, '0');
  const a = Math.round(rgba.a * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}${a}`;
}

// RGB to HSL conversion
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return { h: round(h * 360), s: round(s * 100), l: round(l * 100) };
}

export function rgbaToHsla(rgba: RGBA): HSLA {
  const hsl = rgbToHsl(rgba);
  return { ...hsl, a: round(rgba.a, 3) };
}

// HSL to RGB conversion
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export function hslaToRgba(hsla: HSLA): RGBA {
  const rgb = hslToRgb(hsla);
  return { ...rgb, a: hsla.a };
}

// RGB to HSV conversion
export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    return { h: 0, s: round(s * 100), v: round(v * 100) };
  }

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return { h: round(h * 360), s: round(s * 100), v: round(v * 100) };
}

export function rgbaToHsva(rgba: RGBA): HSVA {
  const hsv = rgbToHsv(rgba);
  return { ...hsv, a: round(rgba.a, 3) };
}

// HSV to RGB conversion
export function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0, g = 0, b = 0;

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hsvaToRgba(hsva: HSVA): RGBA {
  const rgb = hsvToRgb(hsva);
  return { ...rgb, a: hsva.a };
}

// Linear RGB conversion (for OKLAB)
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(clamp(v * 255, 0, 255));
}

// RGB to OKLAB conversion
export function rgbToOklab(rgb: RGB): OKLAB {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: round(0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_, 4),
    a: round(1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_, 4),
    b: round(0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_, 4),
  };
}

export function rgbaToOklaba(rgba: RGBA): OKLABA {
  const oklab = rgbToOklab(rgba);
  return { ...oklab, alpha: round(rgba.a, 3) };
}

// OKLAB to RGB conversion
export function oklabToRgb(oklab: OKLAB): RGB {
  const l_ = oklab.L + 0.3963377774 * oklab.a + 0.2158037573 * oklab.b;
  const m_ = oklab.L - 0.1055613458 * oklab.a - 0.0638541728 * oklab.b;
  const s_ = oklab.L - 0.0894841775 * oklab.a - 1.2914855480 * oklab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
  };
}

export function oklabaToRgba(oklaba: OKLABA): RGBA {
  const rgb = oklabToRgb(oklaba);
  return { ...rgb, a: oklaba.alpha };
}

// OKLAB to OKLCH conversion
export function oklabToOklch(oklab: OKLAB): OKLCH {
  const C = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
  let h = Math.atan2(oklab.b, oklab.a) * (180 / Math.PI);
  if (h < 0) h += 360;
  
  return {
    L: round(oklab.L, 4),
    C: round(C, 4),
    h: round(h, 2),
  };
}

export function rgbToOklch(rgb: RGB): OKLCH {
  const oklab = rgbToOklab(rgb);
  return oklabToOklch(oklab);
}

export function rgbaToOklcha(rgba: RGBA): OKLCHA {
  const oklch = rgbToOklch(rgba);
  return { ...oklch, a: round(rgba.a, 3) };
}

// OKLCH to OKLAB conversion
export function oklchToOklab(oklch: OKLCH): OKLAB {
  const hRad = oklch.h * (Math.PI / 180);
  return {
    L: oklch.L,
    a: round(oklch.C * Math.cos(hRad), 4),
    b: round(oklch.C * Math.sin(hRad), 4),
  };
}

export function oklchToRgb(oklch: OKLCH): RGB {
  const oklab = oklchToOklab(oklch);
  return oklabToRgb(oklab);
}

export function oklchaToRgba(oklcha: OKLCHA): RGBA {
  const rgb = oklchToRgb(oklcha);
  return { ...rgb, a: oklcha.a };
}

// Parse any color string
export function parseColor(color: string): RGBA | null {
  const trimmed = color.trim().toLowerCase();
  
  // HEX format
  if (trimmed.startsWith('#')) {
    return parseHex(trimmed);
  }
  
  // RGB/RGBA format
  const rgbMatch = trimmed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    return {
      r: clamp(parseInt(rgbMatch[1]), 0, 255),
      g: clamp(parseInt(rgbMatch[2]), 0, 255),
      b: clamp(parseInt(rgbMatch[3]), 0, 255),
      a: rgbMatch[4] !== undefined ? clamp(parseFloat(rgbMatch[4]), 0, 1) : 1,
    };
  }
  
  // HSL/HSLA format
  const hslMatch = trimmed.match(/^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hslMatch) {
    const hsla: HSLA = {
      h: parseFloat(hslMatch[1]) % 360,
      s: clamp(parseFloat(hslMatch[2]), 0, 100),
      l: clamp(parseFloat(hslMatch[3]), 0, 100),
      a: hslMatch[4] !== undefined ? clamp(parseFloat(hslMatch[4]), 0, 1) : 1,
    };
    return hslaToRgba(hsla);
  }
  
  // OKLCH format - oklch(L% C h / a) or oklch(L C h / a)
  const oklchMatch = trimmed.match(/^oklch\s*\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/);
  if (oklchMatch) {
    const L = parseFloat(oklchMatch[1]);
    const oklcha: OKLCHA = {
      L: L > 1 ? L / 100 : L,
      C: parseFloat(oklchMatch[2]),
      h: parseFloat(oklchMatch[3]),
      a: oklchMatch[4] !== undefined ? parseFloat(oklchMatch[4]) : 1,
    };
    return oklchaToRgba(oklcha);
  }
  
  return null;
}

// Generate full ColorValue from RGBA
export function rgbaToColorValue(rgba: RGBA): ColorValue {
  const rgb: RGB = { r: rgba.r, g: rgba.g, b: rgba.b };
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const oklab = rgbToOklab(rgb);
  const oklch = rgbToOklch(rgb);
  
  return {
    hex: rgbaToHex(rgba),
    hex8: rgbaToHex8(rgba),
    rgb,
    rgba,
    hsl,
    hsla: { ...hsl, a: rgba.a },
    hsv,
    hsva: { ...hsv, a: rgba.a },
    oklab,
    oklch,
    oklcha: { ...oklch, a: rgba.a },
  };
}

// Format color for CSS output
export function formatColor(color: ColorValue, format: string): string {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'hex8':
      return color.hex8;
    case 'rgb':
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case 'rgba':
      return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
    case 'hsl':
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    case 'hsla':
      return `hsla(${color.hsla.h}, ${color.hsla.s}%, ${color.hsla.l}%, ${color.hsla.a})`;
    case 'hsv':
      return `hsv(${color.hsv.h}, ${color.hsv.s}%, ${color.hsv.v}%)`;
    case 'hsva':
      return `hsva(${color.hsva.h}, ${color.hsva.s}%, ${color.hsva.v}%, ${color.hsva.a})`;
    case 'oklab':
      return `oklab(${color.oklab.L} ${color.oklab.a} ${color.oklab.b})`;
    case 'oklch':
      return `oklch(${(color.oklch.L * 100).toFixed(1)}% ${color.oklch.C.toFixed(3)} ${color.oklch.h.toFixed(1)})`;
    case 'oklcha':
      return `oklch(${(color.oklcha.L * 100).toFixed(1)}% ${color.oklcha.C.toFixed(3)} ${color.oklcha.h.toFixed(1)} / ${color.oklcha.a})`;
    default:
      return color.hex;
  }
}
