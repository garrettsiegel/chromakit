import type {
  RGB,
  RGBA,
  OKLCHA,
  OKLABA,
  ColorValue,
  ColorFormat,
} from '../types';
import { clamp } from './math';
import { parseHex, rgbaToHex, rgbaToHex8 } from './hex';
import { rgbToHsl } from './hsl';
import { rgbToHsv } from './hsv';
import { rgbToOklab, rgbToOklch, oklchaToRgba, oklabaToRgba } from './oklab';
import { labToRgb, lchToRgb } from './lab';
import { hwbToRgb } from './hwb';
import { getNamedColor } from './named-colors';
import {
  component,
  alphaComponent,
  hueComponent,
  parseRgbFunction,
  parseHslFunction,
  parseHsvFunction,
} from './parse-css-functions';

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

  const rgbParsed = parseRgbFunction(trimmed);
  if (rgbParsed) return rgbParsed;

  const hslParsed = parseHslFunction(trimmed);
  if (hslParsed) return hslParsed;

  const hsvParsed = parseHsvFunction(trimmed);
  if (hsvParsed) return hsvParsed;

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

  // ACCEPTS oklch(L% C h / a) AND oklch(L C h / a); hue may be negative or
  // carry a `deg` suffix, alpha may be a percentage.
  const oklchMatch = trimmed.match(
    /^oklch\s*\(\s*(-?[\d.]+)%?\s+([\d.]+)\s+(-?[\d.]+)(?:deg)?(?:\s*\/\s*(-?[\d.]+)(%?))?\s*\)$/
  );
  if (oklchMatch) {
    const L = parseFloat(oklchMatch[1]);
    const oklcha: OKLCHA = {
      L: clamp(L > 1 ? L / 100 : L, 0, 1),
      C: parseFloat(oklchMatch[2]),
      h: hueComponent(oklchMatch[3]),
      a: alphaComponent(oklchMatch[4], oklchMatch[5]),
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
    // A bare L above 1 is read as a percentage, matching an explicit `%`.
    const lIsPercent = Boolean(oklabMatch[2]) || L > 1;
    const oklaba: OKLABA = {
      L: clamp(lIsPercent ? L / 100 : L, 0, 1),
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

/**
 * Integer values stay integers; non-integers keep one decimal. Keeps the
 * picker's text fields round-trip-stable: a displayed 1-decimal value parses
 * back far closer to the original color than a rounded integer.
 */
function percentPart(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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
      return `hsl(${percentPart(color.hsl.h)}, ${percentPart(color.hsl.s)}%, ${percentPart(color.hsl.l)}%)`;
    case 'hsla':
      return `hsla(${percentPart(color.hsla.h)}, ${percentPart(color.hsla.s)}%, ${percentPart(color.hsla.l)}%, ${color.hsla.a.toFixed(2)})`;
    case 'hsv':
      return `hsv(${percentPart(color.hsv.h)}, ${percentPart(color.hsv.s)}%, ${percentPart(color.hsv.v)}%)`;
    case 'hsva':
      return `hsva(${percentPart(color.hsva.h)}, ${percentPart(color.hsva.s)}%, ${percentPart(color.hsva.v)}%, ${color.hsva.a.toFixed(2)})`;
    case 'oklab':
      return `oklab(${color.oklab.L.toFixed(2)} ${color.oklab.a.toFixed(2)} ${color.oklab.b.toFixed(2)})`;
    case 'oklaba':
      return `oklab(${color.oklaba.L.toFixed(2)} ${color.oklaba.a.toFixed(2)} ${color.oklaba.b.toFixed(2)} / ${color.oklaba.alpha.toFixed(2)})`;
    case 'oklch':
      return `oklch(${(color.oklch.L * 100).toFixed(1)}% ${color.oklch.C.toFixed(3)} ${color.oklch.h.toFixed(1)})`;
    case 'oklcha':
      return `oklch(${(color.oklcha.L * 100).toFixed(1)}% ${color.oklcha.C.toFixed(3)} ${color.oklcha.h.toFixed(1)} / ${color.oklcha.a.toFixed(2)})`;
    default:
      return color.hex;
  }
}
