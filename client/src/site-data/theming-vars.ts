import type { PropRow } from '@/components/docs/props-table-types';

export const themingVars: PropRow[] = [
  {
    name: '--ck-primary',
    default: '#111111',
    description: 'Active tabs, focus rings, selected swatches, hover borders.',
  },
  {
    name: '--ck-on-primary',
    default: '#ffffff',
    description: 'Text and icons drawn on a --ck-primary fill.',
  },
  {
    name: '--ck-accent',
    default: '#111111',
    description: 'Second stop of the copied-state fill.',
  },
  {
    name: '--ck-primary-glow',
    default: 'transparent',
    description: 'Glow behind interactive elements (used by the glass theme).',
  },
  {
    name: '--ck-frame',
    default: '#111111',
    description: 'Outer picker border.',
  },
  {
    name: '--ck-bg',
    default: '#ffffff',
    description: 'Picker background.',
  },
  {
    name: '--ck-bg-secondary',
    default: '#f4f4f4',
    description: 'Hover and secondary surfaces.',
  },
  {
    name: '--ck-text',
    default: '#111111',
    description: 'Primary text.',
  },
  {
    name: '--ck-text-muted',
    default: '#5c5c5c',
    description: 'Labels and secondary text.',
  },
  {
    name: '--ck-glass-bg',
    default: '#ffffff',
    description: 'Panel, input, and button fill.',
  },
  {
    name: '--ck-glass-bg-strong',
    default: '#ffffff',
    description: 'Hovered and focused fill.',
  },
  {
    name: '--ck-glass-border',
    default: '#d4d4d4',
    description: 'Hairline borders inside the picker.',
  },
  {
    name: '--ck-glass-shadow',
    default: 'none',
    description: 'Control shadow.',
  },
  {
    name: '--ck-glass-shadow-lg',
    default: 'none',
    description: 'Panel shadow.',
  },
  {
    name: '--ck-blur',
    default: 'none',
    description: 'Backdrop blur.',
  },
  {
    name: '--ck-blur-strong',
    default: 'none',
    description: 'Stronger backdrop blur.',
  },
  {
    name: '--ck-radius',
    default: '0px',
    description: 'Outer corner radius.',
  },
  {
    name: '--ck-radius-md',
    default: '0px',
    description: 'Color area and preview radius.',
  },
  {
    name: '--ck-radius-sm',
    default: '0px',
    description: 'Inputs, buttons, and swatches radius.',
  },
  {
    name: '--ck-track-radius',
    default: '0px',
    description: 'Hue and alpha track radius.',
  },
];
