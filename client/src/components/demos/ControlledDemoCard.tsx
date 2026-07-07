import { useState } from 'react';
import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

const controlledCode = `const [color, setColor] = useState('#6366F1');

<ColorPicker
  value={color}
  onChange={(c) => setColor(c.hex)}
  onChangeComplete={(c) => console.log('final', c.oklch)}
/>`;

export const ControlledDemoCard = () => {
  const [color, setColor] = useState('#6366F1');
  return (
    <DemoCard code={controlledCode}>
      <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />
    </DemoCard>
  );
};
