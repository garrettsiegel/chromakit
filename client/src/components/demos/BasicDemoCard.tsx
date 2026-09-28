import { useState, type ReactNode } from 'react';
import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

export const BasicDemoCard = ({ code }: { code?: ReactNode }) => {
  const [color, setColor] = useState('#6366F1');
  return (
    <DemoCard code={code}>
      <ColorPicker value={color} onChange={(c) => setColor(c.hex8)} />
    </DemoCard>
  );
};
