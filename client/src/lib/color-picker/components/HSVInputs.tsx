import { hsvaToRgba } from '../conversions';
import { createChannelEditor } from './create-channel-editor';

export const HSVInputs = createChannelEditor({
  space: 'hsv',
  channels: [
    { key: 'h', label: 'H', min: 0, max: 360, format: (v) => Math.round(v) },
    { key: 's', label: 'S', min: 0, max: 100, format: (v) => Math.round(v) },
    { key: 'v', label: 'V', min: 0, max: 100, format: (v) => Math.round(v) },
    { key: 'a', label: 'A', min: 0, max: 1, step: 0.01, format: (v) => v },
  ],
  select: (colorValue) => colorValue.hsva,
  // Emitted as rgba() because `parseColor` has no hsv() syntax.
  serialize: (hsva) => {
    const { r, g, b, a } = hsvaToRgba(hsva);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  },
});
