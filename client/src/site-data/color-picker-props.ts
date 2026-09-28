import type { PropRow } from '@/components/docs/props-table-types';

// MIRRORS ColorPickerProps IN lib/color-picker/types.ts
export const colorPickerProps: PropRow[] = [
  {
    name: 'value',
    type: 'string',
    description: 'Controlled color in any supported format (hex, rgb, oklch…).',
  },
  {
    name: 'layout',
    type: "'compact' | 'wide'",
    default: "'compact'",
    description:
      'compact: a 280px column. wide: a 520px side-by-side layout with a preset-group menu.',
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
    default: 'all 12 formats',
    description: 'Which formats the format dropdown offers.',
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
    name: 'showEyeDropper',
    type: 'boolean',
    default: 'true',
    description:
      'Show the screen color sampler where the browser supports the EyeDropper API; hidden elsewhere.',
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
    type: 'number | string',
    description:
      'Picker width, as pixels or any CSS width value. Values below ~520px render the stacked layout.',
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
