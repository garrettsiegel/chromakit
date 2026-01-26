import { describe, it, expect } from 'vitest';
import {
  parseHex,
  rgbaToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToOklab,
  oklabToRgb,
  rgbToOklch,
  oklchToRgb,
} from './conversions';
import type { RGB } from './types';

// Helper functions to simplify tests
const hexToRgb = (hex: string): RGB | null => {
  const result = parseHex(hex);
  if (!result) return null;
  return { r: result.r, g: result.g, b: result.b };
};

const rgbToHex = (rgb: RGB): string => {
  return rgbaToHex({ ...rgb, a: 1 });
};

describe('Color Conversions', () => {
  describe('HEX <-> RGB', () => {
    it('converts hex to rgb', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('handles 3-digit hex codes', () => {
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#00f')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('converts rgb to hex', () => {
      expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
      expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
      expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });

    it('handles invalid hex codes', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#gg0000')).toBeNull();
      expect(hexToRgb('')).toBeNull();
    });
  });

  describe('RGB <-> HSL', () => {
    it('converts rgb to hsl', () => {
      // Red
      const red = rgbToHsl({ r: 255, g: 0, b: 0 });
      expect(red.h).toBeCloseTo(0, 0);
      expect(red.s).toBeCloseTo(100, 0);
      expect(red.l).toBeCloseTo(50, 0);

      // Green
      const green = rgbToHsl({ r: 0, g: 255, b: 0 });
      expect(green.h).toBeCloseTo(120, 0);
      expect(green.s).toBeCloseTo(100, 0);
      expect(green.l).toBeCloseTo(50, 0);

      // Blue
      const blue = rgbToHsl({ r: 0, g: 0, b: 255 });
      expect(blue.h).toBeCloseTo(240, 0);
      expect(blue.s).toBeCloseTo(100, 0);
      expect(blue.l).toBeCloseTo(50, 0);

      // White
      const white = rgbToHsl({ r: 255, g: 255, b: 255 });
      expect(white.s).toBe(0);
      expect(white.l).toBe(100);

      // Black
      const black = rgbToHsl({ r: 0, g: 0, b: 0 });
      expect(black.s).toBe(0);
      expect(black.l).toBe(0);
    });

    it('converts hsl to rgb', () => {
      // Red
      expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });

      // Green
      expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({
        r: 0,
        g: 255,
        b: 0,
      });

      // Blue
      expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({
        r: 0,
        g: 0,
        b: 255,
      });

      // White
      expect(hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });

      // Black
      expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('round-trips correctly', () => {
      const original = { r: 123, g: 45, b: 200 };
      const hsl = rgbToHsl(original);
      const backToRgb = hslToRgb(hsl);

      expect(backToRgb.r).toBeCloseTo(original.r, 0);
      expect(backToRgb.g).toBeCloseTo(original.g, 0);
      expect(backToRgb.b).toBeCloseTo(original.b, 0);
    });
  });

  describe('RGB <-> HSV', () => {
    it('converts rgb to hsv', () => {
      // Red
      const red = rgbToHsv({ r: 255, g: 0, b: 0 });
      expect(red.h).toBeCloseTo(0, 0);
      expect(red.s).toBeCloseTo(100, 0);
      expect(red.v).toBeCloseTo(100, 0);

      // Green
      const green = rgbToHsv({ r: 0, g: 255, b: 0 });
      expect(green.h).toBeCloseTo(120, 0);
      expect(green.s).toBeCloseTo(100, 0);
      expect(green.v).toBeCloseTo(100, 0);

      // Blue
      const blue = rgbToHsv({ r: 0, g: 0, b: 255 });
      expect(blue.h).toBeCloseTo(240, 0);
      expect(blue.s).toBeCloseTo(100, 0);
      expect(blue.v).toBeCloseTo(100, 0);
    });

    it('converts hsv to rgb', () => {
      // Red
      expect(hsvToRgb({ h: 0, s: 100, v: 100 })).toEqual({
        r: 255,
        g: 0,
        b: 0,
      });

      // Green
      expect(hsvToRgb({ h: 120, s: 100, v: 100 })).toEqual({
        r: 0,
        g: 255,
        b: 0,
      });

      // Blue
      expect(hsvToRgb({ h: 240, s: 100, v: 100 })).toEqual({
        r: 0,
        g: 0,
        b: 255,
      });
    });
  });

  describe('RGB <-> OKLAB', () => {
    it('converts rgb to oklab', () => {
      // Red
      const red = rgbToOklab({ r: 255, g: 0, b: 0 });
      expect(red.L).toBeGreaterThan(0);
      expect(red.a).toBeGreaterThan(0);
      expect(red.b).toBeGreaterThan(0);

      // White
      const white = rgbToOklab({ r: 255, g: 255, b: 255 });
      expect(white.L).toBeCloseTo(1, 1);
      expect(white.a).toBeCloseTo(0, 2);
      expect(white.b).toBeCloseTo(0, 2);

      // Black
      const black = rgbToOklab({ r: 0, g: 0, b: 0 });
      expect(black.L).toBeCloseTo(0, 1);
      expect(black.a).toBeCloseTo(0, 2);
      expect(black.b).toBeCloseTo(0, 2);
    });

    it('converts oklab to rgb', () => {
      // White
      const white = oklabToRgb({ L: 1, a: 0, b: 0 });
      expect(white.r).toBeCloseTo(255, 0);
      expect(white.g).toBeCloseTo(255, 0);
      expect(white.b).toBeCloseTo(255, 0);

      // Black
      const black = oklabToRgb({ L: 0, a: 0, b: 0 });
      expect(black.r).toBeCloseTo(0, 0);
      expect(black.g).toBeCloseTo(0, 0);
      expect(black.b).toBeCloseTo(0, 0);
    });

    it('round-trips correctly', () => {
      const original = { r: 100, g: 150, b: 200 };
      const oklab = rgbToOklab(original);
      const backToRgb = oklabToRgb(oklab);

      expect(backToRgb.r).toBeCloseTo(original.r, 0);
      expect(backToRgb.g).toBeCloseTo(original.g, 0);
      expect(backToRgb.b).toBeCloseTo(original.b, 0);
    });
  });

  describe('RGB <-> OKLCH', () => {
    it('converts rgb to oklch', () => {
      // Red
      const red = rgbToOklch({ r: 255, g: 0, b: 0 });
      expect(red.L).toBeGreaterThan(0);
      expect(red.C).toBeGreaterThan(0);
      expect(red.h).toBeGreaterThan(0);

      // White
      const white = rgbToOklch({ r: 255, g: 255, b: 255 });
      expect(white.L).toBeCloseTo(1, 1);
      expect(white.C).toBeCloseTo(0, 2);

      // Black
      const black = rgbToOklch({ r: 0, g: 0, b: 0 });
      expect(black.L).toBeCloseTo(0, 1);
      expect(black.C).toBeCloseTo(0, 2);
    });

    it('converts oklch to rgb', () => {
      // White
      const white = oklchToRgb({ L: 1, C: 0, h: 0 });
      expect(white.r).toBeCloseTo(255, 0);
      expect(white.g).toBeCloseTo(255, 0);
      expect(white.b).toBeCloseTo(255, 0);

      // Black
      const black = oklchToRgb({ L: 0, C: 0, h: 0 });
      expect(black.r).toBeCloseTo(0, 0);
      expect(black.g).toBeCloseTo(0, 0);
      expect(black.b).toBeCloseTo(0, 0);
    });

    it('round-trips correctly', () => {
      const original = { r: 100, g: 150, b: 200 };
      const oklch = rgbToOklch(original);
      const backToRgb = oklchToRgb(oklch);

      expect(backToRgb.r).toBeCloseTo(original.r, 0);
      expect(backToRgb.g).toBeCloseTo(original.g, 0);
      expect(backToRgb.b).toBeCloseTo(original.b, 0);
    });
  });

  describe('Edge Cases', () => {
    it('handles values at boundaries', () => {
      // RGB boundaries
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');

      // HSL boundaries
      expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 });
      expect(hslToRgb({ h: 360, s: 100, l: 100 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
    });

    it('clamps out-of-range values', () => {
      const rgb = oklabToRgb({ L: 1.5, a: 0.5, b: 0.5 });
      expect(rgb.r).toBeLessThanOrEqual(255);
      expect(rgb.g).toBeLessThanOrEqual(255);
      expect(rgb.b).toBeLessThanOrEqual(255);
      expect(rgb.r).toBeGreaterThanOrEqual(0);
      expect(rgb.g).toBeGreaterThanOrEqual(0);
      expect(rgb.b).toBeGreaterThanOrEqual(0);
    });
  });
});
