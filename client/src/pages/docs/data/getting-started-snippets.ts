export const installCode = `npm install chromakit-react`;

export const basicUsageCode = `import { useState } from 'react';
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

export function Example() {
  const [color, setColor] = useState('#6366F1');

  return (
    <ColorPicker
      value={color}
      onChange={(c) => setColor(c.hex)}
    />
  );
}`;

export const nextAppCode = `'use client';
import { useState } from 'react';
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

export function MyColorPicker() {
  const [color, setColor] = useState('#6366F1');
  return <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />;
}`;

export const nextPagesCode = `import dynamic from 'next/dynamic';

const ColorPicker = dynamic(
  () => import('chromakit-react').then((mod) => mod.ColorPicker),
  { ssr: false }
);`;

export const viteCode = `import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';
// Works out of the box`;

export const oklchCode = `// HSL: same lightness value, different perceived brightness
hsl(240, 100%, 50%) // Blue  — looks dark
hsl(60, 100%, 50%)  // Yellow — looks bright

// OKLCH: same lightness = same perceived brightness
oklch(50% 0.2 240)  // Blue   at 50% brightness
oklch(50% 0.2 60)   // Yellow at 50% brightness`;
