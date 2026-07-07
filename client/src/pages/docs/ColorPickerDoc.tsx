import { useState } from 'react';
import { ColorPicker } from '@/lib/color-picker';
import { DocSection } from '@/components/docs/DocSection';
import { DemoCard } from '@/components/docs/DemoCard';
import { CodeBlock } from '@/components/demo/CodeBlock';
import { PropsTable } from '@/components/docs/PropsTable';
import { colorPickerProps } from './data/color-picker-props';

const DefaultDemo = () => {
  const [color, setColor] = useState('#6366F1');
  return <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />;
};

const PresetDemo = () => (
  <ColorPicker
    defaultValue="#22c55e"
    presets={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7']}
  />
);

const FormatDemo = () => (
  <ColorPicker defaultValue="#3b82f6" formats={['hex', 'rgb', 'oklch']} />
);

const presetCode = `<ColorPicker
  defaultValue="#22c55e"
  presets={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7']}
/>`;

const formatCode = `<ColorPicker
  defaultValue="#3b82f6"
  formats={['hex', 'rgb', 'oklch']}
/>`;

const controlledCode = `const [color, setColor] = useState('#6366F1');

<ColorPicker
  value={color}
  onChange={(c) => setColor(c.hex)}
  onChangeComplete={(c) => console.log('final', c.oklch)}
/>`;

const colorValueCode = `interface ColorValue {
  hex: string;    // "#ff6b6b"
  hex8: string;   // "#ff6b6bff"
  rgb: RGB;       // { r, g, b }
  rgba: RGBA;     // { r, g, b, a }
  hsl: HSL;       // { h, s, l }
  hsla: HSLA;     // { h, s, l, a }
  hsv: HSV;       // { h, s, v }
  hsva: HSVA;     // { h, s, v, a }
  oklab: OKLAB;   // { L, a, b }
  oklch: OKLCH;   // { L, C, h }
  oklcha: OKLCHA; // { L, C, h, a }
}`;

export default function ColorPickerDoc() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">ColorPicker</h1>
        <p className="text-lg text-muted-foreground">
          The batteries-included component: color area, hue and alpha sliders,
          format-switchable inputs, presets, history, and copy — all
          configurable through props.
        </p>
      </div>

      <DocSection
        id="controlled"
        title="Controlled vs. uncontrolled"
        description="Pass value + onChange for a controlled picker, or defaultValue alone to let ChromaKit manage state. onChange fires continuously; onChangeComplete fires when the interaction settles."
      >
        <DemoCard code={controlledCode}>
          <DefaultDemo />
        </DemoCard>
      </DocSection>

      <DocSection
        id="props"
        title="Props"
        description="Every ColorValue passed to onChange contains all formats pre-converted, so you never convert manually."
      >
        <PropsTable rows={colorPickerProps} />
      </DocSection>

      <DocSection
        id="color-value"
        title="The ColorValue object"
        description="onChange and onChangeComplete both receive this fully-converted object."
      >
        <CodeBlock code={colorValueCode} language="typescript" />
      </DocSection>

      <DocSection
        id="presets"
        title="Custom presets"
        description="Supply your own swatches with the presets array, or named groups via presetGroups."
      >
        <DemoCard code={presetCode}>
          <PresetDemo />
        </DemoCard>
      </DocSection>

      <DocSection
        id="format-control"
        title="Format control"
        description="Restrict the input tabs to the formats your app cares about."
      >
        <DemoCard code={formatCode}>
          <FormatDemo />
        </DemoCard>
      </DocSection>
    </>
  );
}
