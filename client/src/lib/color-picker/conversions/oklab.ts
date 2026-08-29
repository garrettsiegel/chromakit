import type { RGB, RGBA, OKLAB, OKLABA, OKLCH, OKLCHA } from '../types';
import {
  clamp,
  round,
  srgbToLinear,
  linearToSrgbChannel,
  linearToSrgb,
} from './math';

/** Linear-light sRGB channels for an OKLab color, before gamut mapping. */
function oklabToLinearSrgb(oklab: OKLAB): [number, number, number] {
  const l_ = oklab.L + 0.3963377774 * oklab.a + 0.2158037573 * oklab.b;
  const m_ = oklab.L - 0.1055613458 * oklab.a - 0.0638541728 * oklab.b;
  const s_ = oklab.L - 0.0894841775 * oklab.a - 1.291485548 * oklab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

// A channel this far outside 0-255 still rounds into range, so treating it as
// in-gamut avoids pointless chroma reduction from floating-point noise.
const GAMUT_TOLERANCE = 0.5;

function isInGamut(linear: [number, number, number]): boolean {
  return linear.every((channel) => {
    const v = linearToSrgbChannel(channel);
    return v >= -GAMUT_TOLERANCE && v <= 255 + GAMUT_TOLERANCE;
  });
}

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
    L: round(0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_, 4),
    a: round(1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_, 4),
    b: round(0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_, 4),
  };
}

export function rgbaToOklaba(rgba: RGBA): OKLABA {
  const oklab = rgbToOklab(rgba);
  return { ...oklab, alpha: round(rgba.a, 3) };
}

/**
 * Convert OKLab to sRGB.
 *
 * Colors outside the sRGB gamut are gamut-mapped by reducing chroma at constant
 * lightness and hue (a binary search for the most saturated in-gamut color),
 * which is what CSS Color 4 prescribes. Clipping each channel independently
 * would be cheaper but visibly shifts the hue of vivid out-of-gamut colors.
 */
export function oklabToRgb(oklab: OKLAB): RGB {
  const L = clamp(oklab.L, 0, 1);
  const direct = oklabToLinearSrgb({ ...oklab, L });

  if (isInGamut(direct)) {
    return {
      r: linearToSrgb(direct[0]),
      g: linearToSrgb(direct[1]),
      b: linearToSrgb(direct[2]),
    };
  }

  const { C, h } = oklabToOklch({ ...oklab, L });
  let low = 0;
  let high = C;

  // 24 halvings resolve chroma far below one 8-bit step.
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (isInGamut(oklabToLinearSrgb(oklchToOklab({ L, C: mid, h })))) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const mapped = oklabToLinearSrgb(oklchToOklab({ L, C: low, h }));
  return {
    r: linearToSrgb(mapped[0]),
    g: linearToSrgb(mapped[1]),
    b: linearToSrgb(mapped[2]),
  };
}

export function oklabaToRgba(oklaba: OKLABA): RGBA {
  const rgb = oklabToRgb(oklaba);
  return { ...rgb, a: oklaba.alpha };
}

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
