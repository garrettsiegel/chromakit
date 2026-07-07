import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

const presetCode = `<ColorPicker
  defaultValue="#22c55e"
  presets={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7']}
/>`;

export const PresetDemoCard = () => (
  <DemoCard code={presetCode}>
    <ColorPicker
      defaultValue="#22c55e"
      presets={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7']}
    />
  </DemoCard>
);
