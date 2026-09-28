import type { ReactNode } from 'react';
import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

export const FormatDemoCard = ({ code }: { code?: ReactNode }) => (
  <DemoCard code={code}>
    <ColorPicker defaultValue="#3b82f6" formats={['hex', 'rgb', 'oklch']} />
  </DemoCard>
);
