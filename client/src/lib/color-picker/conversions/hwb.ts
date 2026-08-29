import type { RGB, HWB } from '../types';
import { clamp, round, rgbToHue } from './math';
import { hslToRgb } from './hsl';

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

  return {
    h: round(rgbToHue(r, g, b, max, delta), 2),
    w: round(min * 100, 2),
    b: round((1 - max) * 100, 2),
  };
}
