import { useState } from 'react';
import { DemoCard } from '@/components/docs/DemoCard';
import { ColorPicker } from '@/lib/color-picker';
import { basicUsageCode } from '@/site-data/getting-started-snippets';

// One React island = one hydrated tree. Astro renders framework-component
// children as static slots, so the live demo must live INSIDE the island
// (here) rather than be passed as a child from the .astro page.
export const BasicDemoCard = () => {
  const [color, setColor] = useState('#6366F1');
  return (
    <DemoCard code={basicUsageCode}>
      <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />
    </DemoCard>
  );
};
