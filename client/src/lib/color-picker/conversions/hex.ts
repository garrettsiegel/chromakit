import type { RGBA } from '../types';

export function parseHex(hex: string): RGBA | null {
  const cleaned = hex.replace('#', '');

  if (
    cleaned.length !== 3 &&
    cleaned.length !== 4 &&
    cleaned.length !== 6 &&
    cleaned.length !== 8
  ) {
    return null;
  }

  if (!/^[0-9A-Fa-f]+$/.test(cleaned)) {
    return null;
  }

  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b, a: 1 };
  }

  if (cleaned.length === 4) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    const a = parseInt(cleaned[3] + cleaned[3], 16) / 255;
    return { r, g, b, a };
  }

  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }

  if (cleaned.length === 8) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    const a = parseInt(cleaned.slice(6, 8), 16) / 255;
    return { r, g, b, a };
  }

  return null;
}

export function rgbaToHex(rgba: RGBA): string {
  const r = Math.round(rgba.r).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function rgbaToHex8(rgba: RGBA): string {
  const r = Math.round(rgba.r).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b).toString(16).padStart(2, '0');
  const a = Math.round(rgba.a * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${r}${g}${b}${a}`;
}
