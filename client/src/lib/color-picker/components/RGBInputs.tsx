import { createChannelEditor } from './create-channel-editor';

export const RGBInputs = createChannelEditor({
  space: 'rgb',
  channels: [
    { key: 'r', label: 'r', min: 0, max: 255, format: (v) => v },
    { key: 'g', label: 'g', min: 0, max: 255, format: (v) => v },
    { key: 'b', label: 'b', min: 0, max: 255, format: (v) => v },
    {
      key: 'a',
      label: 'A',
      min: 0,
      max: 1,
      step: 0.01,
      format: (v) => Number(v.toFixed(2)),
    },
  ],
  select: (colorValue) => colorValue.rgba,
  serialize: ({ r, g, b, a }) =>
    `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`,
});
