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
  parseColor,
  rgbaToColorValue,
  formatColor,
  labToRgb,
  lchToRgb,
  hwbToRgb,
  rgbToHwb,
  getNamedColor,
  getNamedColorNames,
} from './conversions';
import type { RGB, ColorFormat } from './types';

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

  describe('parseColor', () => {
    it('parses hex, rgb, and hsl strings', () => {
      expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('rgb(0, 255, 0)')).toEqual({
        r: 0,
        g: 255,
        b: 0,
        a: 1,
      });
      expect(parseColor('hsl(240, 100%, 50%)')).toEqual({
        r: 0,
        g: 0,
        b: 255,
        a: 1,
      });
    });

    it('parses oklab strings, round-tripping through rgb', () => {
      const red = parseColor('oklab(0.6280 0.2249 0.1258)');
      expect(red).not.toBeNull();
      expect(red?.r).toBeCloseTo(255, -1);
      expect(red?.g).toBeCloseTo(0, -1);
      expect(red?.b).toBeCloseTo(0, -1);
      expect(red?.a).toBe(1);
    });

    it('parses oklab percentages, negative axes, and alpha', () => {
      const numeric = parseColor('oklab(0.65 0.18 -0.08 / 0.5)');
      const percent = parseColor('oklab(65% 45% -20% / 50%)');
      expect(numeric).toEqual(percent);
      expect(numeric?.a).toBe(0.5);
    });

    it('accepts CSS Color 4 space-separated rgb() syntax', () => {
      expect(parseColor('rgb(255 0 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('rgb(100%, 0%, 0%)')).toEqual({
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      });
      expect(parseColor('rgb(255 0 0 / 0.5)')?.a).toBe(0.5);
      expect(parseColor('rgba(255, 0, 0, 50%)')?.a).toBe(0.5);
      expect(parseColor('rgb(1.5, 2.5, 3)')).toEqual({
        r: 2,
        g: 3,
        b: 3,
        a: 1,
      });
    });

    it('accepts deg units, negative hues, and space-separated hsl()', () => {
      expect(parseColor('hsl(120deg, 100%, 50%)')).toEqual({
        r: 0,
        g: 255,
        b: 0,
        a: 1,
      });
      expect(parseColor('hsl(120 100% 50%)')).toEqual({
        r: 0,
        g: 255,
        b: 0,
        a: 1,
      });
      expect(parseColor('hsl(120 100% 50% / 0.5)')?.a).toBe(0.5);
      expect(parseColor('hsl(-30, 100%, 50%)')).toEqual(
        parseColor('hsl(330, 100%, 50%)')
      );
    });

    it('accepts deg hues, negative hues, and percentage alpha in oklch()', () => {
      expect(parseColor('oklch(50% 0.1 120deg)')).toEqual(
        parseColor('oklch(0.5 0.1 120)')
      );
      expect(parseColor('oklch(0.5 0.1 -20)')).toEqual(
        parseColor('oklch(0.5 0.1 340)')
      );
      expect(parseColor('oklch(0.5 0.1 120 / 50%)')?.a).toBe(0.5);
    });

    it('clamps oklch() alpha above 1', () => {
      expect(parseColor('oklch(0.5 0.1 120 / 2)')?.a).toBe(1);
    });

    it('round-trips every ColorFormat through parseColor(formatColor(...))', () => {
      const value = rgbaToColorValue({ r: 221, g: 254, b: 63, a: 0.5 });
      const formats: ColorFormat[] = [
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
      for (const format of formats) {
        expect(parseColor(formatColor(value, format)), format).not.toBeNull();
      }
    });

    it.each([
      'notacolor',
      '#GGGGGG',
      '',
      'oklab(0.5 0.1)',
      'rgb(255 0)',
      'hsl(120, 100%)',
    ])('returns null for malformed input %j', (input) => {
      expect(parseColor(input)).toBeNull();
    });
  });

  describe('formatColor', () => {
    const color = rgbaToColorValue({ r: 255, g: 0, b: 0, a: 0.5 });

    const expectations: [ColorFormat, RegExp][] = [
      ['hex', /^#[0-9a-f]{6}$/],
      ['hex8', /^#[0-9a-f]{8}$/],
      ['rgb', /^rgb\(255, 0, 0\)$/],
      ['rgba', /^rgba\(255, 0, 0, 0\.50\)$/],
      ['hsl', /^hsl\(0, 100%, 50%\)$/],
      ['hsla', /^hsla\(0, 100%, 50%, 0\.50\)$/],
      ['hsv', /^hsv\(0, 100%, 100%\)$/],
      ['hsva', /^hsva\(0, 100%, 100%, 0\.50\)$/],
      ['oklab', /^oklab\(-?\d+\.\d{2} -?\d+\.\d{2} -?\d+\.\d{2}\)$/],
      ['oklch', /^oklch\(\d+% \d+\.\d{2} \d+\)$/],
      ['oklcha', /^oklch\(\d+% \d+\.\d{2} \d+ \/ 0\.50\)$/],
    ];

    it.each(expectations)('formats %s correctly', (format, pattern) => {
      expect(formatColor(color, format)).toMatch(pattern);
    });
  });

  describe('Named colors', () => {
    it('parses CSS color keywords', () => {
      expect(parseColor('red')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('rebeccapurple')).toEqual({
        r: 102,
        g: 51,
        b: 153,
        a: 1,
      });
      expect(parseColor('  WHITE  ')).toEqual({
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      });
    });

    it('treats transparent as fully clear', () => {
      expect(parseColor('transparent')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    });

    it('accepts both gray and grey spellings', () => {
      expect(parseColor('gray')).toEqual(parseColor('grey'));
      expect(parseColor('darkgray')).toEqual(parseColor('darkgrey'));
    });

    it('returns null for words that are not colors', () => {
      expect(parseColor('notacolor')).toBeNull();
      expect(getNamedColor('notacolor')).toBeNull();
    });

    it('exposes the full CSS keyword list', () => {
      const names = getNamedColorNames();
      expect(names).toHaveLength(148);
      expect(names).toContain('rebeccapurple');
      expect(names).not.toContain('transparent');
    });
  });

  describe('HWB', () => {
    it('converts hwb to rgb', () => {
      expect(hwbToRgb({ h: 0, w: 0, b: 0 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(hwbToRgb({ h: 120, w: 0, b: 0 })).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('returns a gray when whiteness and blackness saturate', () => {
      expect(hwbToRgb({ h: 200, w: 50, b: 50 })).toEqual({
        r: 128,
        g: 128,
        b: 128,
      });
      expect(hwbToRgb({ h: 200, w: 100, b: 0 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
    });

    it('round-trips through rgb', () => {
      const original: RGB = { r: 120, g: 180, b: 60 };
      const back = hwbToRgb(rgbToHwb(original));
      expect(back.r).toBeCloseTo(original.r, -1);
      expect(back.g).toBeCloseTo(original.g, -1);
      expect(back.b).toBeCloseTo(original.b, -1);
    });

    it('parses hwb strings with optional alpha', () => {
      expect(parseColor('hwb(0 0% 0%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('hwb(0deg 0% 0% / 50%)')?.a).toBe(0.5);
    });
  });

  describe('CIE Lab and LCH', () => {
    it('converts lab white and black correctly', () => {
      expect(labToRgb({ L: 100, a: 0, b: 0 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
      expect(labToRgb({ L: 0, a: 0, b: 0 })).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('parses lab strings, including percentages and negatives', () => {
      const red = parseColor('lab(54.29% 80.8 69.89)');
      expect(red?.r).toBeCloseTo(255, -1);
      expect(red?.g).toBeCloseTo(0, -1);

      const numeric = parseColor('lab(50 40 -30)');
      const percent = parseColor('lab(50% 32% -24%)');
      expect(numeric).toEqual(percent);
    });

    it('parses lch strings and agrees with the lab equivalent', () => {
      const viaLch = parseColor('lch(54.29% 106.84 40.86)');
      const viaLab = parseColor('lab(54.29% 80.8 69.89)');
      expect(viaLch).not.toBeNull();
      expect(viaLab).not.toBeNull();
      expect(viaLch?.r).toBeCloseTo(viaLab?.r ?? -1, -1);
      expect(viaLch?.g).toBeCloseTo(viaLab?.g ?? -1, -1);
      expect(viaLch?.b).toBeCloseTo(viaLab?.b ?? -1, -1);
    });

    it('supports lch alpha and deg units', () => {
      expect(parseColor('lch(50 40 120deg / 0.25)')?.a).toBe(0.25);
    });

    it('rejects malformed lab and lch', () => {
      expect(parseColor('lab(50 40)')).toBeNull();
      expect(parseColor('lch(50)')).toBeNull();
    });

    it('exposes lchToRgb directly', () => {
      expect(lchToRgb({ L: 100, C: 0, h: 0 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
    });
  });

  describe('Gamut mapping', () => {
    it('leaves in-gamut colors untouched', () => {
      const original: RGB = { r: 200, g: 100, b: 50 };
      expect(oklabToRgb(rgbToOklab(original))).toEqual(original);
    });

    it('preserves hue for out-of-gamut chroma instead of clipping', () => {
      // A vivid green far outside sRGB. Per-channel clipping would drag the
      // result toward a different hue; chroma reduction should not.
      const requestedHue = rgbToOklch({ r: 0, g: 255, b: 0 }).h;
      const mapped = oklabToRgb({ L: 0.87, a: -0.4, b: 0.3 });
      const mappedHue = rgbToOklch(mapped).h;
      expect(Math.abs(mappedHue - requestedHue)).toBeLessThan(12);
    });

    it('keeps every channel inside the sRGB range', () => {
      const mapped = oklabToRgb({ L: 0.6, a: 0.5, b: -0.5 });
      for (const channel of [mapped.r, mapped.g, mapped.b]) {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      }
    });

    it('clamps lightness beyond the 0-1 range', () => {
      expect(oklabToRgb({ L: 1.5, a: 0, b: 0 })).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
      expect(oklabToRgb({ L: -0.5, a: 0, b: 0 })).toEqual({
        r: 0,
        g: 0,
        b: 0,
      });
    });
  });

  describe('oklaba format', () => {
    it('formats oklab with alpha', () => {
      const color = rgbaToColorValue({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(formatColor(color, 'oklaba')).toMatch(
        /^oklab\(-?\d+\.\d{2} -?\d+\.\d{2} -?\d+\.\d{2} \/ 0\.50\)$/
      );
    });

    it('round-trips through parseColor', () => {
      const color = rgbaToColorValue({ r: 12, g: 200, b: 90, a: 0.4 });
      const parsed = parseColor(formatColor(color, 'oklaba'));
      expect(parsed?.a).toBe(0.4);
      expect(parsed?.g).toBeCloseTo(200, -2);
    });

    it('exposes oklaba on the color value', () => {
      const color = rgbaToColorValue({ r: 255, g: 0, b: 0, a: 0.25 });
      expect(color.oklaba.alpha).toBe(0.25);
      expect(color.oklaba.L).toBe(color.oklab.L);
    });
  });
});
