import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

const formatCode = `<ColorPicker
  defaultValue="#3b82f6"
  formats={['hex', 'rgb', 'oklch']}
/>`;

export const FormatDemoCard = () => (
  <DemoCard code={formatCode}>
    <ColorPicker defaultValue="#3b82f6" formats={['hex', 'rgb', 'oklch']} />
  </DemoCard>
);
