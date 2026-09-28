import { createChannelEditor } from './create-channel-editor';

// ALPHA IS KEYED `alpha` BECAUSE OKLAB ALREADY USES `a` FOR ITS GREEN-RED AXIS
export const OKLABInputs = createChannelEditor({
  space: 'oklab',
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
      key: 'a',
      label: 'a',
      min: -0.4,
      max: 0.4,
      step: 0.001,
      format: (v) => v.toFixed(3),
    },
    {
      key: 'b',
      label: 'b',
      min: -0.4,
      max: 0.4,
      step: 0.001,
      format: (v) => v.toFixed(3),
    },
    {
      key: 'alpha',
      label: 'A',
      min: 0,
      max: 1,
      step: 0.01,
      format: (v) => v.toFixed(2),
    },
  ],
  select: (colorValue) => colorValue.oklaba,
  serialize: ({ L, a, b, alpha }) => `oklab(${L} ${a} ${b} / ${alpha})`,
});
