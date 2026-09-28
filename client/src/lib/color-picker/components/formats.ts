import type { ColorFormat } from '../types';

export const COLOR_FORMATS: ColorFormat[] = [
  'hex',
  'hex8',
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'hsv',
  'hsva',
  'oklab',
  'oklaba',
  'oklch',
  'oklcha',
];

const ALPHA_FORMATS = new Set<ColorFormat>([
  'hex8',
  'rgba',
  'hsla',
  'hsva',
  'oklaba',
  'oklcha',
]);

export const hasAlpha = (format: ColorFormat): boolean =>
  ALPHA_FORMATS.has(format);
