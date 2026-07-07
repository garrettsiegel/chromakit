import type {
  RGB,
  RGBA,
  HSLA,
  OKLCHA,
  ColorValue,
  ColorFormat,
} from '../types';
import { clamp } from './math';
import { parseHex, rgbaToHex, rgbaToHex8 } from './hex';
import { rgbToHsl, hslaToRgba } from './hsl';
import { rgbToHsv } from './hsv';
import { rgbToOklab, rgbToOklch, oklchaToRgba } from './oklab';

export function parseColor(color: string): RGBA | null {
  const trimmed = color.trim().toLowerCase();

  if (trimmed.startsWith('#')) {
    return parseHex(trimmed);
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
    case 'oklch':
      return `oklch(${(color.oklch.L * 100).toFixed(0)}% ${color.oklch.C.toFixed(2)} ${Math.round(color.oklch.h)})`;
    case 'oklcha':
      return `oklch(${(color.oklcha.L * 100).toFixed(0)}% ${color.oklcha.C.toFixed(2)} ${Math.round(color.oklcha.h)} / ${color.oklcha.a.toFixed(2)})`;
    default:
      return color.hex;
  }
}
