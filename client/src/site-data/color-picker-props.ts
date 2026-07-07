import type { PropRow } from '@/components/docs/PropsTable';

// Sourced from ColorPickerProps in lib/color-picker/types.ts and the
// default values in components/ColorPicker.tsx.
export const colorPickerProps: PropRow[] = [
  {
    name: 'value',
    type: 'string',
    description: 'Controlled color in any supported format (hex, rgb, oklch…).',
  },
  {
    name: 'defaultValue',
    type: 'string',
    default: "'#6366F1'",
    description: 'Initial color for uncontrolled mode.',
  },
  {
    name: 'onChange',
    type: '(color: ColorValue) => void',
    description: 'Fires on every change (drag, typing) with all formats.',
  },
  {
    name: 'onChangeComplete',
    type: '(color: ColorValue) => void',
    description: 'Fires when a change settles (pointer up).',
  },
  {
    name: 'formats',
    type: 'ColorFormat[]',
    default: 'all 11 formats',
    description: 'Which format tabs the inputs expose.',
  },
  {
    name: 'showAlpha',
    type: 'boolean',
    default: 'true',
    description: 'Show the alpha (transparency) slider.',
  },
  {
    name: 'showInputs',
    type: 'boolean',
    default: 'true',
    description: 'Show the numeric / text input fields.',
  },
  {
    name: 'showPreview',
    type: 'boolean',
    default: 'true',
    description: 'Show the color preview swatch.',
  },
  {
    name: 'showPresets',
    type: 'boolean',
    default: 'true',
    description: 'Show the preset color swatches section.',
  },
  {
    name: 'showCopyButton',
    type: 'boolean',
    default: 'true',
    description: 'Show the copy-to-clipboard button.',
  },
  {
    name: 'presets',
    type: 'string[]',
    default: 'built-in',
    description: 'Custom preset colors.',
  },
  {
    name: 'presetGroups',
    type: 'PresetGroup[] | Record<string, string[]>',
    default: 'built-in',
    description: 'Named preset groups selectable from a dropdown.',
  },
  {
    name: 'enableHistory',
    type: 'boolean',
    default: 'true',
    description: 'Remember recent colors in localStorage.',
  },
  {
    name: 'historySize',
    type: 'number',
    default: '10',
    description: 'Maximum number of colors kept in history.',
  },
  {
    name: 'width',
    type: 'number',
    description: 'Picker width in pixels. Auto when omitted.',
  },
  {
    name: 'height',
    type: 'number',
    description:
      'Color-area height in pixels. Stretches to match the controls when omitted.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes on the root — the theming hook (see Theming).',
  },
];
