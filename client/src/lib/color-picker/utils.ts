import type { RGB, RGBA as _RGBA, ColorValue as _ColorValue } from './types';
import { rgbToHsv, hsvToRgb } from './conversions';

/**
 * Calculate relative luminance of a color
 * Used for WCAG contrast ratio calculations
 */
export function getRelativeLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: RGB, color2: RGB): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsContrastRatio(
  ratio: number,
  level: 'AA' | 'AAA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Color harmony generators
 */

export function getComplementaryColor(rgb: RGB): RGB {
  const hsv = rgbToHsv(rgb);
  return hsvToRgb({ ...hsv, h: (hsv.h + 180) % 360 });
}

export function getAnalogousColors(rgb: RGB, angle = 30): RGB[] {
  const hsv = rgbToHsv(rgb);
  return [
    hsvToRgb({ ...hsv, h: (hsv.h - angle + 360) % 360 }),
    rgb,
    hsvToRgb({ ...hsv, h: (hsv.h + angle) % 360 }),
  ];
}

export function getTriadicColors(rgb: RGB): RGB[] {
  const hsv = rgbToHsv(rgb);
  return [
    rgb,
    hsvToRgb({ ...hsv, h: (hsv.h + 120) % 360 }),
    hsvToRgb({ ...hsv, h: (hsv.h + 240) % 360 }),
  ];
}

export function getSplitComplementaryColors(rgb: RGB, angle = 30): RGB[] {
  const hsv = rgbToHsv(rgb);
  const complementary = (hsv.h + 180) % 360;
  return [
    rgb,
    hsvToRgb({ ...hsv, h: (complementary - angle + 360) % 360 }),
    hsvToRgb({ ...hsv, h: (complementary + angle) % 360 }),
  ];
}

export function getTetradicColors(rgb: RGB, angle = 60): RGB[] {
  const hsv = rgbToHsv(rgb);
  return [
    rgb,
    hsvToRgb({ ...hsv, h: (hsv.h + angle) % 360 }),
    hsvToRgb({ ...hsv, h: (hsv.h + 180) % 360 }),
    hsvToRgb({ ...hsv, h: (hsv.h + 180 + angle) % 360 }),
  ];
}

/**
 * Color history management with localStorage
 */

const HISTORY_KEY = 'chromakit-color-history';
const MAX_HISTORY_SIZE = 10;

export function getColorHistory(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

export function addToColorHistory(color: string): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const history = getColorHistory();
    // Remove if already exists
    const filtered = history.filter((c) => c !== color);
    // Add to beginning
    const updated = [color, ...filtered].slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearColorHistory(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Copy to clipboard utility
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if EyeDropper API is supported
 */

/**
 * Open native eyedropper to pick color from screen
 */
