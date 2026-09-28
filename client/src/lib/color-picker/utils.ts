import type { RGB } from './types';
import { rgbToHsv, hsvToRgb } from './conversions';
import { srgbToLinear } from './conversions/math';
import { MAX_HISTORY_SIZE } from './constants';

/**
 * Calculate relative luminance of a color
 * Used for WCAG contrast ratio calculations
 */
export function getRelativeLuminance(rgb: RGB): number {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
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

const HISTORY_KEY = 'chromakit-color-history';

const hasLocalStorage = (): boolean =>
  typeof window !== 'undefined' && Boolean(window.localStorage);

export function getColorHistory(): string[] {
  if (!hasLocalStorage()) {
    return [];
  }
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    if (!history) return [];
    const parsed: unknown = JSON.parse(history);
    return Array.isArray(parsed)
      ? parsed.filter((c): c is string => typeof c === 'string')
      : [];
  } catch {
    return [];
  }
}

export function addToColorHistory(
  color: string,
  maxSize: number = MAX_HISTORY_SIZE
): string[] {
  if (!hasLocalStorage()) {
    return [];
  }
  try {
    const history = getColorHistory();
    const filtered = history.filter((c) => c !== color);
    const updated = [color, ...filtered].slice(0, Math.max(0, maxSize));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearColorHistory(): void {
  if (!hasLocalStorage()) {
    return;
  }
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // IGNORE STORAGE ERRORS
  }
}

/**
 * Copy to clipboard utility
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // FALLBACK FOR BROWSERS WITHOUT THE ASYNC CLIPBOARD API
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

// TYPED LOCALLY: TYPESCRIPT'S DOM LIB DOES NOT DECLARE EYEDROPPER (CHROMIUM-ONLY) YET
interface EyeDropperInstance {
  open: () => Promise<{ sRGBHex: string }>;
}

type EyeDropperConstructor = new () => EyeDropperInstance;

function getEyeDropper(): EyeDropperConstructor | null {
  if (typeof window === 'undefined') return null;
  const ctor = (window as unknown as { EyeDropper?: EyeDropperConstructor })
    .EyeDropper;
  return typeof ctor === 'function' ? ctor : null;
}

/** Whether this browser can sample colors from the screen. */
export function isEyeDropperSupported(): boolean {
  return getEyeDropper() !== null;
}

/**
 * Open the screen color sampler. Resolves to a hex string, or null when the
 * API is unavailable or the user dismissed the picker.
 */
export async function openEyeDropper(): Promise<string | null> {
  const EyeDropperCtor = getEyeDropper();
  if (!EyeDropperCtor) return null;
  try {
    const result = await new EyeDropperCtor().open();
    return result.sRGBHex;
  } catch {
    return null;
  }
}
