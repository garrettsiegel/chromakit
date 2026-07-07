import type { PropRow } from '@/components/docs/PropsTable';

export interface ComponentDoc {
  name: string;
  description: string;
  props: PropRow[];
}

export interface ComponentGroup {
  id: string;
  title: string;
  description: string;
  components: ComponentDoc[];
}

const dragProps: PropRow[] = [
  {
    name: 'hsva',
    type: 'HSVA',
    required: true,
    description: 'Current color as HSVA (from useColorState).',
  },
  {
    name: 'onChange',
    type: '(hsva: HSVA) => void',
    required: true,
    description: 'Called as the user drags.',
  },
  { name: 'onStart', type: '() => void', description: 'Fires on drag start.' },
  { name: 'onEnd', type: '() => void', description: 'Fires on drag end.' },
  { name: 'className', type: 'string', description: 'Extra classes.' },
];

const channelInputProps: PropRow[] = [
  {
    name: 'colorValue',
    type: 'ColorValue',
    required: true,
    description: 'Current color (all formats).',
  },
  {
    name: 'onChange',
    type: '(colorString: string) => void',
    required: true,
    description: 'Receives the edited color as a string.',
  },
  {
    name: 'showAlpha',
    type: 'boolean',
    description: 'Include the alpha channel field.',
  },
  { name: 'className', type: 'string', description: 'Extra classes.' },
];

export const componentGroups: ComponentGroup[] = [
  {
    id: 'canvas-sliders',
    title: 'Canvas & sliders',
    description:
      'The draggable surfaces. All three take the same drag interface, so they compose cleanly around a single useColorState.',
    components: [
      {
        name: 'ColorArea',
        description: '2D saturation / value square.',
        props: [
          ...dragProps.slice(0, 4),
          { name: 'width', type: 'number', description: 'Width in pixels.' },
          { name: 'height', type: 'number', description: 'Height in pixels.' },
          dragProps[4],
        ],
      },
      {
        name: 'HueSlider',
        description: 'Hue selection track.',
        props: [
          ...dragProps.slice(0, 4),
          {
            name: 'vertical',
            type: 'boolean',
            default: 'false',
            description: 'Render vertically.',
          },
          dragProps[4],
        ],
      },
      {
        name: 'AlphaSlider',
        description: 'Transparency track with checkerboard.',
        props: [
          ...dragProps.slice(0, 4),
          {
            name: 'vertical',
            type: 'boolean',
            default: 'false',
            description: 'Render vertically.',
          },
          dragProps[4],
        ],
      },
    ],
  },
  {
    id: 'inputs',
    title: 'Inputs',
    description:
      'Text / numeric fields. ColorInputs switches formats itself; the per-space variants render a fixed set of channels.',
    components: [
      {
        name: 'ColorInputs',
        description: 'Format-switchable input group.',
        props: [
          channelInputProps[0],
          channelInputProps[1],
          {
            name: 'format',
            type: 'ColorFormat',
            required: true,
            description: 'Active format.',
          },
          {
            name: 'onFormatChange',
            type: '(format: ColorFormat) => void',
            description: 'Called when the user switches format.',
          },
          channelInputProps[2],
          {
            name: 'availableFormats',
            type: 'ColorFormat[]',
            description: 'Formats offered in the switcher.',
          },
          channelInputProps[3],
        ],
      },
      {
        name: 'RGBInputs · HSLInputs · HSVInputs · OKLCHInputs',
        description:
          'Fixed per-space channel fields. Identical prop shape across all four.',
        props: channelInputProps,
      },
    ],
  },
  {
    id: 'display',
    title: 'Display',
    description: 'Read-only and action pieces.',
    components: [
      {
        name: 'ColorPreview',
        description: 'Swatch, optionally comparing against an original color.',
        props: [
          {
            name: 'colorValue',
            type: 'ColorValue',
            required: true,
            description: 'Color to preview.',
          },
          {
            name: 'showComparison',
            type: 'boolean',
            description: 'Split the swatch to show before / after.',
          },
          {
            name: 'originalColor',
            type: 'string',
            description: 'The "before" color for comparison.',
          },
          {
            name: 'size',
            type: "'sm' | 'md' | 'lg'",
            default: "'md'",
            description: 'Swatch size.',
          },
          { name: 'className', type: 'string', description: 'Extra classes.' },
        ],
      },
      {
        name: 'ColorSwatch',
        description: 'A single selectable color button.',
        props: [
          {
            name: 'color',
            type: 'string',
            required: true,
            description: 'The color it represents.',
          },
          {
            name: 'selected',
            type: 'boolean',
            description: 'Show the active ring.',
          },
          { name: 'onClick', type: '() => void', description: 'Click handler.' },
          {
            name: 'onLongPress',
            type: '() => void',
            description: 'Long-press handler (edit).',
          },
          {
            name: 'onDelete',
            type: '() => void',
            description: 'Delete handler.',
          },
          {
            name: 'editing',
            type: 'boolean',
            description: 'Render in editing state.',
          },
          { name: 'className', type: 'string', description: 'Extra classes.' },
        ],
      },
      {
        name: 'CopyButton',
        description: 'Copies text to the clipboard with feedback.',
        props: [
          {
            name: 'text',
            type: 'string',
            required: true,
            description: 'The text to copy.',
          },
          {
            name: 'label',
            type: 'string',
            description: 'Accessible label / tooltip.',
          },
          {
            name: 'onCopy',
            type: '(success: boolean) => void',
            description: 'Called after a copy attempt.',
          },
          { name: 'className', type: 'string', description: 'Extra classes.' },
        ],
      },
    ],
  },
  {
    id: 'collections',
    title: 'Collections',
    description: 'Swatch grids for presets and history.',
    components: [
      {
        name: 'PresetColors',
        description: 'Editable preset grid with optional named groups.',
        props: [
          {
            name: 'colors',
            type: 'string[]',
            required: true,
            description: 'Swatches to display.',
          },
          {
            name: 'onSelect',
            type: '(color: string) => void',
            required: true,
            description: 'Called when a swatch is chosen.',
          },
          {
            name: 'selectedColor',
            type: 'string',
            description: 'Highlights the matching swatch.',
          },
          {
            name: 'editable',
            type: 'boolean',
            description: 'Allow add / edit / delete.',
          },
          {
            name: 'presetGroups',
            type: 'PresetGroup[]',
            description: 'Named groups for the dropdown.',
          },
          { name: 'className', type: 'string', description: 'Extra classes.' },
        ],
      },
      {
        name: 'RecentColors',
        description:
          'Recently used colors. Reads localStorage on mount, or renders the colors prop when supplied.',
        props: [
          {
            name: 'onColorSelect',
            type: '(color: string) => void',
            required: true,
            description: 'Called when a recent color is chosen.',
          },
          {
            name: 'colors',
            type: 'string[]',
            description: 'Controlled list; overrides localStorage.',
          },
          { name: 'className', type: 'string', description: 'Extra classes.' },
        ],
      },
    ],
  },
];
