export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const round = (value: number, precision: number = 2): number =>
  Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
