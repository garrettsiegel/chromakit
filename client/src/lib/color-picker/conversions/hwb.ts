import type { RGB, HWB } from '../types';
import { clamp } from './math';
import { hslToRgb } from './hsl';
import { round } from './math';

/**
 * Convert CSS `hwb()` to sRGB. Whiteness and blackness that sum to 100% or more
 * produce a gray whose level is their ratio, per CSS Color 4.
 */
export function hwbToRgb(hwb: HWB): RGB {
  const w = clamp(hwb.w, 0, 100) / 100;
  const b = clamp(hwb.b, 0, 100) / 100;

  if (w + b >= 1) {
    const gray = Math.round((w / (w + b)) * 255);
    return { r: gray, g: gray, b: gray };
  }

  const base = hslToRgb({ h: hwb.h, s: 100, l: 50 });
  const mix = (channel: number): number =>
    Math.round((channel / 255) * (1 - w - b) * 255 + w * 255);

  return { r: mix(base.r), g: mix(base.g), b: mix(base.b) };
}

/** Convert sRGB to CSS `hwb()` components. */
export function rgbToHwb(rgb: RGB): HWB {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: round(h, 2),
    w: round(min * 100, 2),
    b: round((1 - max) * 100, 2),
  };
}
