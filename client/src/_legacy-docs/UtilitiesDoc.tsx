import { useColorState } from '@/lib/color-picker';
import { DocSection } from '@/components/docs/DocSection';
import { DemoCard } from '@/components/docs/DemoCard';
import { CodeBlock } from '@/components/demo/CodeBlock';
import { PropsTable } from '@/components/docs/PropsTable';
import { ColorFormatsDisplay } from '@/components/demo/ColorFormatsDisplay';
import { conversionGroups, helperRows } from '@/site-data/utilities-data';

const converterCode = `import { parseColor, rgbaToColorValue, formatColor } from 'chromakit-react';

const rgba = parseColor('#6366F1');          // { r, g, b, a }
const value = rgbaToColorValue(rgba);         // every format
const oklch = formatColor(value, 'oklch');    // "oklch(55% 0.22 277)"`;

const ConverterDemo = () => {
  const { colorValue, setFromString } = useColorState('#6366F1');
  return (
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
  );
};

const labels = { name: 'Function', type: 'Signature' } as const;

export default function UtilitiesDoc() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Color Utilities</h1>
        <p className="text-lg text-muted-foreground">
          Every conversion and helper the picker uses internally is exported, so
          you can parse, convert, and analyze colors without rendering any UI.
        </p>
      </div>

      <DocSection
        id="live-converter"
        title="Live converter"
        description="parseColor accepts any format; rgbaToColorValue expands it into all of them. The demo below parses your input and shows formatColor output for each space."
      >
        <DemoCard code={converterCode}>
          <ConverterDemo />
        </DemoCard>
      </DocSection>

      {conversionGroups.map((group) => (
        <DocSection
          key={group.id}
          id={group.id}
          title={group.title}
          description={group.description}
        >
          <PropsTable rows={group.rows} labels={labels} showDefault={false} />
        </DocSection>
      ))}

      <DocSection
        id="helpers"
        title="Color helpers"
        description="Accessibility checks and harmony generators built on the conversions above."
      >
        <PropsTable rows={helperRows} labels={labels} showDefault={false} />
        <CodeBlock
          code={`import { parseColor, getContrastRatio, meetsContrastRatio } from 'chromakit-react';

const fg = parseColor('#1a1a1a');
const bg = parseColor('#ffffff');
const ratio = getContrastRatio(fg, bg);          // 18.1
const passes = meetsContrastRatio(ratio, 'AA');  // true`}
          language="typescript"
        />
      </DocSection>
    </>
  );
}
