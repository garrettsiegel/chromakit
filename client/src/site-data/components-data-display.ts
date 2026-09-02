import type { ComponentGroup } from './components-data';

export const displayGroup: ComponentGroup =   {
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
          {
            name: 'onClick',
            type: '() => void',
            description: 'Click handler.',
          },
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
      {
        name: 'EyeDropperButton',
        description:
          'Screen color sampler backed by the EyeDropper API. Renders nothing where the API is unavailable.',
        props: [
          {
            name: 'onPick',
            type: '(color: string) => void',
            required: true,
            description: 'Receives the picked hex color.',
          },
          {
            name: 'label',
            type: 'string',
            default: "'Pick color from screen'",
            description: 'Accessible label / tooltip.',
          },
          { name: 'className', type: 'string', description: 'Extra classes.' },
        ],
      },
    ],
  };
