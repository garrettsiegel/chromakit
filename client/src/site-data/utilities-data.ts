import type { PropRow } from '@/components/docs/PropsTable';

export interface UtilGroup {
  id: string;
  title: string;
  description: string;
  rows: PropRow[];
}

// All entries mirror the exports in lib/color-picker/index.ts.
export const conversionGroups: UtilGroup[] = [
  {
    id: 'parse-format',
    title: 'Parse & format',
    description: 'Turn strings into structured colors and back again.',
    rows: [
      {
        name: 'parseColor',
        type: '(color: string) => RGBA | null',
        description: 'Parse any supported format string to RGBA.',
      },
      {
        name: 'parseHex',
        type: '(hex: string) => RGBA | null',
        description: 'Parse a 3/6/8-digit hex string.',
      },
      {
        name: 'rgbaToColorValue',
        type: '(rgba: RGBA) => ColorValue',
        description: 'Expand an RGBA into every format at once.',
      },
      {
        name: 'formatColor',
        type: '(color: ColorValue, format: ColorFormat) => string',
        description: 'Render a ColorValue as a CSS string.',
      },
    ],
  },
  {
    id: 'hex-rgb',
    title: 'Hex',
    description: 'RGBA ↔ hex.',
    rows: [
      {
        name: 'rgbaToHex',
        type: '(rgba: RGBA) => string',
        description: '6-digit hex.',
      },
      {
        name: 'rgbaToHex8',
        type: '(rgba: RGBA) => string',
        description: '8-digit hex (with alpha).',
      },
    ],
  },
  {
    id: 'hsl-hsv',
    title: 'HSL & HSV',
    description: 'Cylindrical RGB models.',
    rows: [
      {
        name: 'rgbToHsl',
        type: '(rgb: RGB) => HSL',
        description: 'RGB → HSL.',
      },
      {
        name: 'hslToRgb',
        type: '(hsl: HSL) => RGB',
        description: 'HSL → RGB.',
      },
      {
        name: 'rgbaToHsla',
        type: '(rgba: RGBA) => HSLA',
        description: 'RGBA → HSLA.',
      },
      {
        name: 'hslaToRgba',
        type: '(hsla: HSLA) => RGBA',
        description: 'HSLA → RGBA.',
      },
      {
        name: 'rgbToHsv',
        type: '(rgb: RGB) => HSV',
        description: 'RGB → HSV.',
      },
      {
        name: 'hsvToRgb',
        type: '(hsv: HSV) => RGB',
        description: 'HSV → RGB.',
      },
      {
        name: 'rgbaToHsva',
        type: '(rgba: RGBA) => HSVA',
        description: 'RGBA → HSVA.',
      },
      {
        name: 'hsvaToRgba',
        type: '(hsva: HSVA) => RGBA',
        description: 'HSVA → RGBA.',
      },
    ],
  },
  {
    id: 'oklab-oklch',
    title: 'OKLAB & OKLCH',
    description: 'Perceptually uniform spaces.',
    rows: [
      {
        name: 'rgbToOklab',
        type: '(rgb: RGB) => OKLAB',
        description: 'RGB → OKLAB.',
      },
      {
        name: 'oklabToRgb',
        type: '(oklab: OKLAB) => RGB',
        description: 'OKLAB → RGB.',
      },
      {
        name: 'rgbToOklch',
        type: '(rgb: RGB) => OKLCH',
        description: 'RGB → OKLCH.',
      },
      {
        name: 'oklchToRgb',
        type: '(oklch: OKLCH) => RGB',
        description: 'OKLCH → RGB.',
      },
      {
        name: 'oklabToOklch',
        type: '(oklab: OKLAB) => OKLCH',
        description: 'OKLAB → OKLCH.',
      },
      {
        name: 'oklchToOklab',
        type: '(oklch: OKLCH) => OKLAB',
        description: 'OKLCH → OKLAB.',
      },
      {
        name: 'rgbaToOklaba',
        type: '(rgba: RGBA) => OKLABA',
        description: 'RGBA → OKLABA.',
      },
      {
        name: 'oklabaToRgba',
        type: '(oklaba: OKLABA) => RGBA',
        description: 'OKLABA → RGBA.',
      },
      {
        name: 'rgbaToOklcha',
        type: '(rgba: RGBA) => OKLCHA',
        description: 'RGBA → OKLCHA.',
      },
      {
        name: 'oklchaToRgba',
        type: '(oklcha: OKLCHA) => RGBA',
        description: 'OKLCHA → RGBA.',
      },
    ],
  },
  {
    id: 'hwb-lab-lch',
    title: 'HWB, CIE Lab & LCH',
    description: 'Additional CSS Color 4 spaces (Lab and LCH use D50).',
    rows: [
      {
        name: 'hwbToRgb',
        type: '(hwb: HWB) => RGB',
        description: 'HWB → RGB.',
      },
      {
        name: 'rgbToHwb',
        type: '(rgb: RGB) => HWB',
        description: 'RGB → HWB.',
      },
      {
        name: 'labToRgb',
        type: '(lab: LAB) => RGB',
        description: 'CIE Lab → RGB.',
      },
      {
        name: 'lchToRgb',
        type: '(lch: LCH) => RGB',
        description: 'CIE LCH → RGB.',
      },
      {
        name: 'lchToLab',
        type: '(lch: LCH) => LAB',
        description: 'CIE LCH → CIE Lab.',
      },
    ],
  },
  {
    id: 'named-colors',
    title: 'Named colors',
    description: 'The 148 CSS color keywords.',
    rows: [
      {
        name: 'getNamedColor',
        type: '(name: string) => string | null',
        description: 'Resolve a CSS keyword to hex, or null.',
      },
      {
        name: 'getNamedColorNames',
        type: '() => string[]',
        description: 'Every supported CSS color keyword.',
      },
    ],
  },
];

export const helperRows: PropRow[] = [
  {
    name: 'getRelativeLuminance',
    type: '(rgb: RGB) => number',
    description: 'WCAG relative luminance.',
  },
  {
    name: 'getContrastRatio',
    type: '(a: RGB, b: RGB) => number',
    description: 'WCAG contrast ratio between two colors.',
  },
  {
    name: 'meetsContrastRatio',
    type: "(ratio, level: 'AA'|'AAA', size?) => boolean",
    description: 'Whether a ratio passes a WCAG level.',
  },
  {
    name: 'getComplementaryColor',
    type: '(rgb: RGB) => RGB',
    description: 'The opposite hue.',
  },
  {
    name: 'getAnalogousColors',
    type: '(rgb: RGB, angle?) => RGB[]',
    description: 'Neighboring hues.',
  },
  {
    name: 'getTriadicColors',
    type: '(rgb: RGB) => RGB[]',
    description: 'Three evenly spaced hues.',
  },
  {
    name: 'getSplitComplementaryColors',
    type: '(rgb: RGB, angle?) => RGB[]',
    description: 'Split-complementary scheme.',
  },
  {
    name: 'getTetradicColors',
    type: '(rgb: RGB, angle?) => RGB[]',
    description: 'Four-color scheme.',
  },
  {
    name: 'getColorHistory',
    type: '() => string[]',
    description: 'Read persisted color history.',
  },
  {
    name: 'addToColorHistory',
    type: '(color: string, maxSize?) => string[]',
    description: 'Add a color to history.',
  },
  {
    name: 'clearColorHistory',
    type: '() => void',
    description: 'Empty the stored history.',
  },
  {
    name: 'copyToClipboard',
    type: '(text: string) => Promise<boolean>',
    description: 'Copy text, resolving to success.',
  },
  {
    name: 'isEyeDropperSupported',
    type: '() => boolean',
    description: 'Whether this browser can sample screen colors.',
  },
  {
    name: 'openEyeDropper',
    type: '() => Promise<string | null>',
    description: 'Sample a screen color; null if cancelled.',
  },
];
