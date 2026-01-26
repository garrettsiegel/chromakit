import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getRelativeLuminance,
  getContrastRatio,
  meetsContrastRatio,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getTetradicColors,
  getColorHistory,
  addToColorHistory,
  clearColorHistory,
} from './utils';
import type { RGB } from './types';

describe('Color Accessibility Utils', () => {
  describe('getRelativeLuminance', () => {
    it('should calculate luminance for black', () => {
      const black: RGB = { r: 0, g: 0, b: 0 };
      expect(getRelativeLuminance(black)).toBe(0);
    });

    it('should calculate luminance for white', () => {
      const white: RGB = { r: 255, g: 255, b: 255 };
      expect(getRelativeLuminance(white)).toBeCloseTo(1, 1);
    });

    it('should calculate luminance for gray', () => {
      const gray: RGB = { r: 128, g: 128, b: 128 };
      const luminance = getRelativeLuminance(gray);
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });
  });

  describe('getContrastRatio', () => {
    it('should return 21 for black on white', () => {
      const black: RGB = { r: 0, g: 0, b: 0 };
      const white: RGB = { r: 255, g: 255, b: 255 };
      expect(getContrastRatio(black, white)).toBeCloseTo(21, 0);
    });

    it('should return 1 for identical colors', () => {
      const color: RGB = { r: 128, g: 128, b: 128 };
      expect(getContrastRatio(color, color)).toBe(1);
    });

    it('should be commutative', () => {
      const color1: RGB = { r: 255, g: 0, b: 0 };
      const color2: RGB = { r: 0, g: 0, b: 255 };
      expect(getContrastRatio(color1, color2)).toBe(
        getContrastRatio(color2, color1)
      );
    });
  });

  describe('meetsContrastRatio', () => {
    it('should pass AA for normal text at 4.5:1', () => {
      expect(meetsContrastRatio(4.5, 'AA', 'normal')).toBe(true);
      expect(meetsContrastRatio(4.4, 'AA', 'normal')).toBe(false);
    });

    it('should pass AA for large text at 3:1', () => {
      expect(meetsContrastRatio(3, 'AA', 'large')).toBe(true);
      expect(meetsContrastRatio(2.9, 'AA', 'large')).toBe(false);
    });

    it('should pass AAA for normal text at 7:1', () => {
      expect(meetsContrastRatio(7, 'AAA', 'normal')).toBe(true);
      expect(meetsContrastRatio(6.9, 'AAA', 'normal')).toBe(false);
    });

    it('should pass AAA for large text at 4.5:1', () => {
      expect(meetsContrastRatio(4.5, 'AAA', 'large')).toBe(true);
      expect(meetsContrastRatio(4.4, 'AAA', 'large')).toBe(false);
    });
  });
});

describe('Color Harmony Utils', () => {
  const testColor: RGB = { r: 255, g: 0, b: 0 }; // Red (hue 0)

  describe('getComplementaryColor', () => {
    it('should return color opposite on color wheel', () => {
      const complementary = getComplementaryColor(testColor);
      // Red's complementary should be cyan-ish
      expect(complementary.r).toBeLessThan(50);
      expect(complementary.g).toBeGreaterThan(200);
      expect(complementary.b).toBeGreaterThan(200);
    });
  });

  describe('getAnalogousColors', () => {
    it('should return 3 colors including the base', () => {
      const colors = getAnalogousColors(testColor, 30);
      expect(colors).toHaveLength(3);
      expect(colors[1]).toEqual(testColor);
    });

    it('should have similar saturation and value', () => {
      const colors = getAnalogousColors(testColor, 30);
      // All should be vibrant reds/oranges/magentas
      colors.forEach((color) => {
        const max = Math.max(color.r, color.g, color.b);
        expect(max).toBeGreaterThan(200);
      });
    });
  });

  describe('getTriadicColors', () => {
    it('should return 3 colors including the base', () => {
      const colors = getTriadicColors(testColor);
      expect(colors).toHaveLength(3);
      expect(colors[0]).toEqual(testColor);
    });

    it('should be evenly spaced on color wheel', () => {
      const colors = getTriadicColors(testColor);
      // Should have red, green, and blue components
      expect(colors[0].r).toBeGreaterThan(200); // Red
      expect(colors[1].g).toBeGreaterThan(200); // Green-ish
      expect(colors[2].b).toBeGreaterThan(200); // Blue-ish
    });
  });

  describe('getSplitComplementaryColors', () => {
    it('should return 3 colors including the base', () => {
      const colors = getSplitComplementaryColors(testColor, 30);
      expect(colors).toHaveLength(3);
      expect(colors[0]).toEqual(testColor);
    });
  });

  describe('getTetradicColors', () => {
    it('should return 4 colors including the base', () => {
      const colors = getTetradicColors(testColor, 60);
      expect(colors).toHaveLength(4);
      expect(colors[0]).toEqual(testColor);
    });
  });
});

describe('Color History Utils', () => {
  beforeEach(() => {
    clearColorHistory();
  });

  afterEach(() => {
    clearColorHistory();
  });

  describe('getColorHistory', () => {
    it('should return empty array initially', () => {
      expect(getColorHistory()).toEqual([]);
    });

    it('should return stored colors', () => {
      addToColorHistory('#ff0000');
      addToColorHistory('#00ff00');
      const history = getColorHistory();
      expect(history).toEqual(['#00ff00', '#ff0000']);
    });
  });

  describe('addToColorHistory', () => {
    it('should add color to history', () => {
      const updated = addToColorHistory('#ff0000');
      expect(updated).toContain('#ff0000');
    });

    it('should add new colors to the beginning', () => {
      addToColorHistory('#ff0000');
      const updated = addToColorHistory('#00ff00');
      expect(updated[0]).toBe('#00ff00');
      expect(updated[1]).toBe('#ff0000');
    });

    it('should not add duplicates', () => {
      addToColorHistory('#ff0000');
      addToColorHistory('#00ff00');
      const updated = addToColorHistory('#ff0000');
      expect(updated).toEqual(['#ff0000', '#00ff00']);
    });

    it('should limit history size to 10', () => {
      for (let i = 0; i < 15; i++) {
        addToColorHistory(`#${i.toString(16).padStart(6, '0')}`);
      }
      const history = getColorHistory();
      expect(history).toHaveLength(10);
    });
  });

  describe('clearColorHistory', () => {
    it('should clear all history', () => {
      addToColorHistory('#ff0000');
      addToColorHistory('#00ff00');
      clearColorHistory();
      expect(getColorHistory()).toEqual([]);
    });
  });
});
