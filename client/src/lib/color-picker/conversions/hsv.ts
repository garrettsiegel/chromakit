import type { RGB, RGBA, HSV, HSVA } from '../types';
import { round, rgbToHue } from './math';

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

  return {
    h: round(rgbToHue(r, g, b, max, d)),
    s: round(s * 100),
    v: round(v * 100),
  };
}

export function rgbaToHsva(rgba: RGBA): HSVA {
  const hsv = rgbToHsv(rgba);
  return { ...hsv, a: round(rgba.a, 3) };
}

export function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0,
    g = 0,
    b = 0;

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
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
