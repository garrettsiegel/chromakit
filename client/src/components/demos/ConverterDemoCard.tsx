import type { ReactNode } from 'react';
import { useColorState } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';
import { ColorFormatsDisplay } from '@/components/shared/ColorFormatsDisplay';

export const ConverterDemoCard = ({ code }: { code?: ReactNode }) => {
  const { colorValue, setFromString } = useColorState('#6366F1');
  return (
    <DemoCard code={code} label="parseColor · formatColor">
      <div className="demo-stack demo-stack--md">
        <label className="demo-field__label" htmlFor="ck-converter">
          Type any color
        </label>
        <input
          id="ck-converter"
          className="demo-field__input"
          defaultValue="#6366F1"
          onChange={(e) => setFromString(e.target.value)}
          placeholder="#6366F1, rgb(99,102,241), oklch(…)"
        />
        <ColorFormatsDisplay colorValue={colorValue} />
      </div>
    </DemoCard>
  );
};
