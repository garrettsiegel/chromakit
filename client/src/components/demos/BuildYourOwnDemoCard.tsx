import type { ReactNode } from 'react';
import { DemoCard } from '@/components/docs/DemoCard';
import { CustomPickerDemo } from '@/components/demos/CustomPickerDemo';

export const BuildYourOwnDemoCard = ({ code }: { code?: ReactNode }) => (
  <DemoCard code={code} label="Composed from primitives">
    <CustomPickerDemo />
  </DemoCard>
);
