import { useState } from 'react';
import { ColorPicker } from '@/lib/color-picker';

export const BasicDemo = () => {
  const [color, setColor] = useState('#6366F1');
  return <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />;
};
