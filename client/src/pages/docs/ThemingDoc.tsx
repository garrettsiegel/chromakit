import { ColorPicker } from '@/lib/color-picker';
import { DocSection } from '@/components/docs/DocSection';
import { DemoCard } from '@/components/docs/DemoCard';
import { CodeBlock } from '@/components/demo/CodeBlock';
import { PropsTable } from '@/components/docs/PropsTable';
import { themingVars } from './data/theming-vars';

const overrideCode = `/* your stylesheet */
.brand-picker {
  --ck-primary: #ec4899;
  --ck-accent: #f43f5e;
  --ck-primary-glow: rgba(236, 72, 153, 0.4);
  --ck-radius: 4px;
  --ck-radius-md: 3px;
  --ck-radius-sm: 2px;
}`;

const applyCode = `<ColorPicker className="brand-picker" />`;

const ThemedDemo = () => (
  <div className="flex flex-wrap items-start justify-center gap-8">
    <div className="space-y-2 text-center">
      <ColorPicker defaultValue="#6366F1" />
      <p className="text-xs text-muted-foreground">Default</p>
    </div>
    <div className="space-y-2 text-center">
      <ColorPicker defaultValue="#ec4899" className="ck-demo-theme" />
      <p className="text-xs text-muted-foreground">
        <code>.ck-demo-theme</code>
      </p>
    </div>
  </div>
);

export default function ThemingDoc() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Theming</h1>
        <p className="text-lg text-muted-foreground">
          ChromaKit is styled entirely with CSS custom properties. Override them
          on a wrapping class (passed via <code>className</code>) to reskin the
          picker — no build config, no props drilling.
        </p>
      </div>

      <DocSection
        id="how-it-works"
        title="Override variables on a class"
        description="Define the --ck-* variables you want to change on a class, then pass that class to the picker. Light and dark themes are handled automatically; you only override what differs."
      >
        <CodeBlock code={overrideCode} language="css" />
        <CodeBlock code={applyCode} />
      </DocSection>

      <DocSection
        id="live"
        title="Live comparison"
        description="The right-hand picker uses the exact override shown above — sharper corners and a pink accent — while the left stays default."
      >
        <DemoCard code={`${overrideCode}\n\n${applyCode}`} language="css">
          <ThemedDemo />
        </DemoCard>
      </DocSection>

      <DocSection
        id="variables"
        title="Available variables"
        description="Defaults shown are the light-theme values; each has a dark-theme counterpart applied under .dark."
      >
        <PropsTable
          rows={themingVars}
          showType={false}
          labels={{ name: 'Variable', default: 'Default (light)' }}
        />
      </DocSection>
    </>
  );
}
