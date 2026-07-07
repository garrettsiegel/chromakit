import { useColorState } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';
import { ColorFormatsDisplay } from '@/components/demo/ColorFormatsDisplay';

const converterCode = `import { parseColor, rgbaToColorValue, formatColor } from 'chromakit-react';

const rgba = parseColor('#6366F1');          // { r, g, b, a }
const value = rgbaToColorValue(rgba);         // every format
const oklch = formatColor(value, 'oklch');    // "oklch(55% 0.22 277)"`;

export const ConverterDemoCard = () => {
  const { colorValue, setFromString } = useColorState('#6366F1');
  return (
    <DemoCard code={converterCode}>
      <div className="w-full max-w-md space-y-3">
        <label className="block text-sm font-medium" htmlFor="ck-converter">
          Type any color
        </label>
        <input
          id="ck-converter"
          defaultValue="#6366F1"
          onChange={(e) => setFromString(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
          placeholder="#6366F1, rgb(99,102,241), oklch(…)"
        />
        <ColorFormatsDisplay colorValue={colorValue} />
      </div>
    </DemoCard>
  );
};
