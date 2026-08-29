import { createChannelEditor } from './create-channel-editor';

export const HSLInputs = createChannelEditor({
  space: 'hsl',
  channels: [
    { key: 'h', label: 'H', min: 0, max: 360, format: (v) => Math.round(v) },
    { key: 's', label: 'S', min: 0, max: 100, format: (v) => Math.round(v) },
    { key: 'l', label: 'L', min: 0, max: 100, format: (v) => Math.round(v) },
    {
      key: 'a',
      label: 'A',
      min: 0,
      max: 1,
      step: 0.01,
      format: (v) => Number(v.toFixed(2)),
    },
  ],
  select: (colorValue) => colorValue.hsla,
  serialize: ({ h, s, l, a }) => `hsla(${h}, ${s}%, ${l}%, ${a})`,
});
