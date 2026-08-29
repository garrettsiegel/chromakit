export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const round = (value: number, precision: number = 2): number =>
  Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

/**
 * Hue in degrees for a set of normalized (0-1) sRGB channels, given their
 * precomputed max and delta. Returns 0 for achromatic colors.
 */
export function rgbToHue(
  r: number,
  g: number,
  b: number,
  max: number,
  delta: number
): number {
  if (delta === 0) return 0;

  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h *= 60;
  return h < 0 ? h + 360 : h;
}

/** Decode an sRGB channel (0-255) to linear light. */
export function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** Encode a linear-light channel as an sRGB value, unclamped and unrounded. */
export function linearToSrgbChannel(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return v * 255;
}

/** Encode a linear-light channel as an sRGB byte, clipped to the gamut. */
export function linearToSrgb(c: number): number {
  return Math.round(clamp(linearToSrgbChannel(c), 0, 255));
}
