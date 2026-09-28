import type { ReactNode } from 'react';
import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

export const WideDemoCard = ({ code }: { code?: ReactNode }) => (
  <DemoCard code={code} label='layout="wide"'>
    <ColorPicker layout="wide" />
  </DemoCard>
);
