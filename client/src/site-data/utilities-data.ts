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
      { name: 'rgbToHsl', type: '(rgb: RGB) => HSL', description: 'RGB → HSL.' },
      { name: 'hslToRgb', type: '(hsl: HSL) => RGB', description: 'HSL → RGB.' },
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
      { name: 'rgbToHsv', type: '(rgb: RGB) => HSV', description: 'RGB → HSV.' },
      { name: 'hsvToRgb', type: '(hsv: HSV) => RGB', description: 'HSV → RGB.' },
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
];
