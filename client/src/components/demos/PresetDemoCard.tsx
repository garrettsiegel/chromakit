import type { ReactNode } from 'react';
import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

export const PresetDemoCard = ({ code }: { code?: ReactNode }) => (
  <DemoCard code={code}>
    <ColorPicker
      defaultValue="#22c55e"
      presets={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7']}
    />
  </DemoCard>
);
