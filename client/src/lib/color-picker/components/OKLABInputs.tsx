import { createChannelEditor } from './create-channel-editor';

// The a/b axes run roughly -0.4 to 0.4; alpha is keyed `alpha` because OKLab
// already uses `a` for its green-red axis.
export const OKLABInputs = createChannelEditor({
  space: 'oklab',
  channels: [
    { key: 'L', label: 'L', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
    { key: 'a', label: 'a', min: -0.4, max: 0.4, step: 0.001, format: (v) => v.toFixed(3) },
    { key: 'b', label: 'b', min: -0.4, max: 0.4, step: 0.001, format: (v) => v.toFixed(3) },
    { key: 'alpha', label: 'A', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  ],
  select: (colorValue) => colorValue.oklaba,
  serialize: ({ L, a, b, alpha }) => `oklab(${L} ${a} ${b} / ${alpha})`,
});
