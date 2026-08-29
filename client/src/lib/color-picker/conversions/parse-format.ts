import type {
  RGB,
  RGBA,
  HSLA,
  OKLCHA,
  OKLABA,
  ColorValue,
  ColorFormat,
} from '../types';
import { clamp } from './math';
import { parseHex, rgbaToHex, rgbaToHex8 } from './hex';
import { rgbToHsl, hslaToRgba } from './hsl';
import { rgbToHsv } from './hsv';
import { rgbToOklab, rgbToOklch, oklchaToRgba, oklabaToRgba } from './oklab';
import { labToRgb, lchToRgb } from './lab';
import { hwbToRgb } from './hwb';
import { getNamedColor } from './named-colors';

/**
 * Resolve one numeric component that may be written as a number or a
 * percentage. `percentReference` is the value 100% stands for.
 */
function component(
  value: string,
  isPercent: string,
  percentReference: number
): number {
  const n = parseFloat(value);
  return isPercent ? (n / 100) * percentReference : n;
}

/** Resolve an optional `/ alpha` component, defaulting to fully opaque. */
function alphaComponent(value?: string, isPercent?: string): number {
  if (value === undefined) return 1;
  return clamp(component(value, isPercent ?? '', 1), 0, 1);
}

export function parseColor(color: string): RGBA | null {
  const trimmed = color.trim().toLowerCase();

  if (trimmed.startsWith('#')) {
    return parseHex(trimmed);
  }

  // CSS color keywords (`red`, `rebeccapurple`, `transparent`).
  if (/^[a-z]+$/.test(trimmed)) {
    const named = getNamedColor(trimmed);
    return named ? parseHex(named) : null;
  }

  const rgbMatch = trimmed.match(
    /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (rgbMatch) {
    return {
      r: clamp(parseInt(rgbMatch[1]), 0, 255),
      g: clamp(parseInt(rgbMatch[2]), 0, 255),
      b: clamp(parseInt(rgbMatch[3]), 0, 255),
      a: rgbMatch[4] !== undefined ? clamp(parseFloat(rgbMatch[4]), 0, 1) : 1,
    };
  }

  const hslMatch = trimmed.match(
    /^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (hslMatch) {
    const hsla: HSLA = {
      h: parseFloat(hslMatch[1]) % 360,
      s: clamp(parseFloat(hslMatch[2]), 0, 100),
      l: clamp(parseFloat(hslMatch[3]), 0, 100),
      a: hslMatch[4] !== undefined ? clamp(parseFloat(hslMatch[4]), 0, 1) : 1,
    };
    return hslaToRgba(hsla);
  }

  // ACCEPTS hwb(H W% B% / A)
  const hwbMatch = trimmed.match(
    /^hwb\s*\(\s*([\d.]+)(?:deg)?\s+([\d.]+)%?\s+([\d.]+)%?(?:\s*\/\s*([\d.]+)(%?))?\s*\)$/
  );
  if (hwbMatch) {
    const rgb = hwbToRgb({
      h: parseFloat(hwbMatch[1]) % 360,
      w: parseFloat(hwbMatch[2]),
      b: parseFloat(hwbMatch[3]),
    });
    return { ...rgb, a: alphaComponent(hwbMatch[4], hwbMatch[5]) };
  }

  // ACCEPTS lab(L a b / A); 100% is 100 for L and 125 for the a/b axes.
  const labMatch = trimmed.match(
    /^lab\s*\(\s*([\d.]+)(%?)\s+(-?[\d.]+)(%?)\s+(-?[\d.]+)(%?)(?:\s*\/\s*([\d.]+)(%?))?\s*\)$/
  );
  if (labMatch) {
    const rgb = labToRgb({
      L: clamp(component(labMatch[1], labMatch[2], 100), 0, 100),
      a: component(labMatch[3], labMatch[4], 125),
      b: component(labMatch[5], labMatch[6], 125),
    });
    return { ...rgb, a: alphaComponent(labMatch[7], labMatch[8]) };
  }

  // ACCEPTS lch(L C H / A); 100% is 100 for L and 150 for chroma.
  const lchMatch = trimmed.match(
    /^lch\s*\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+)(%?))?\s*\)$/
  );
  if (lchMatch) {
    const rgb = lchToRgb({
      L: clamp(component(lchMatch[1], lchMatch[2], 100), 0, 100),
      C: Math.max(0, component(lchMatch[3], lchMatch[4], 150)),
      h: parseFloat(lchMatch[5]) % 360,
    });
    return { ...rgb, a: alphaComponent(lchMatch[6], lchMatch[7]) };
  }

  // ACCEPTS oklch(L% C h / a) AND oklch(L C h / a)
  const oklchMatch = trimmed.match(
    /^oklch\s*\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/
  );
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

  // ACCEPTS oklab(L% a b / A) AND oklab(L a b / A). The a/b axes may be numbers
  // or percentages, where 100% is the 0.4 reference range from the CSS spec.
  const oklabMatch = trimmed.match(
    /^oklab\s*\(\s*([\d.]+)(%?)\s+(-?[\d.]+)(%?)\s+(-?[\d.]+)(%?)(?:\s*\/\s*([\d.]+)(%?))?\s*\)$/
  );
  if (oklabMatch) {
    const L = parseFloat(oklabMatch[1]);
    const oklaba: OKLABA = {
      L: clamp(oklabMatch[2] || L > 1 ? L / 100 : L, 0, 1),
      a: component(oklabMatch[3], oklabMatch[4], 0.4),
      b: component(oklabMatch[5], oklabMatch[6], 0.4),
      alpha: alphaComponent(oklabMatch[7], oklabMatch[8]),
    };
    return oklabaToRgba(oklaba);
  }

  return null;
}

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
    oklaba: { ...oklab, alpha: rgba.a },
    oklch,
    oklcha: { ...oklch, a: rgba.a },
  };
}

export function formatColor(color: ColorValue, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'hex8':
      return color.hex8;
    case 'rgb':
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case 'rgba':
      return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a.toFixed(2)})`;
    case 'hsl':
      return `hsl(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%)`;
    case 'hsla':
      return `hsla(${Math.round(color.hsla.h)}, ${Math.round(color.hsla.s)}%, ${Math.round(color.hsla.l)}%, ${color.hsla.a.toFixed(2)})`;
    case 'hsv':
      return `hsv(${Math.round(color.hsv.h)}, ${Math.round(color.hsv.s)}%, ${Math.round(color.hsv.v)}%)`;
    case 'hsva':
      return `hsva(${Math.round(color.hsva.h)}, ${Math.round(color.hsva.s)}%, ${Math.round(color.hsva.v)}%, ${color.hsva.a.toFixed(2)})`;
    case 'oklab':
      return `oklab(${color.oklab.L.toFixed(2)} ${color.oklab.a.toFixed(2)} ${color.oklab.b.toFixed(2)})`;
    case 'oklaba':
      return `oklab(${color.oklaba.L.toFixed(2)} ${color.oklaba.a.toFixed(2)} ${color.oklaba.b.toFixed(2)} / ${color.oklaba.alpha.toFixed(2)})`;
    case 'oklch':
      return `oklch(${(color.oklch.L * 100).toFixed(0)}% ${color.oklch.C.toFixed(2)} ${Math.round(color.oklch.h)})`;
    case 'oklcha':
      return `oklch(${(color.oklcha.L * 100).toFixed(0)}% ${color.oklcha.C.toFixed(2)} ${Math.round(color.oklcha.h)} / ${color.oklcha.a.toFixed(2)})`;
    default:
      return color.hex;
  }
}
