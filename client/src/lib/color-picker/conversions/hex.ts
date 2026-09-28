import type { RGBA } from '../types';

export function parseHex(hex: string): RGBA | null {
  let cleaned = hex.replace('#', '');

  if (!/^[0-9A-Fa-f]+$/.test(cleaned)) {
    return null;
  }

  if (cleaned.length === 3 || cleaned.length === 4) {
    cleaned = cleaned
      .split('')
      .map((digit) => digit + digit)
      .join('');
  }

  if (cleaned.length !== 6 && cleaned.length !== 8) {
    return null;
  }

  const channel = (start: number): number =>
    parseInt(cleaned.slice(start, start + 2), 16);

  return {
    r: channel(0),
    g: channel(2),
    b: channel(4),
    a: cleaned.length === 8 ? channel(6) / 255 : 1,
  };
}

export function rgbaToHex(rgba: RGBA): string {
  const r = Math.round(rgba.r).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function rgbaToHex8(rgba: RGBA): string {
  const a = Math.round(rgba.a * 255)
    .toString(16)
    .padStart(2, '0');
  return `${rgbaToHex(rgba)}${a}`;
}
