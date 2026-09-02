import { createChannelEditor } from './create-channel-editor';

export const OKLCHInputs = createChannelEditor({
  space: 'oklch',
  channels: [
    {
      key: 'L',
      label: 'L',
      min: 0,
      max: 1,
      step: 0.01,
      format: (v) => v.toFixed(2),
    },
    {
      key: 'C',
      label: 'C',
      min: 0,
      max: 0.4,
      step: 0.001,
      format: (v) => v.toFixed(3),
    },
    { key: 'h', label: 'H', min: 0, max: 360, format: (v) => Math.round(v) },
    {
      key: 'a',
      label: 'A',
      min: 0,
      max: 1,
      step: 0.01,
      format: (v) => v.toFixed(2),
    },
  ],
  select: (colorValue) => colorValue.oklcha,
  serialize: ({ L, C, h, a }) => `oklch(${L} ${C} ${h} / ${a})`,
});
