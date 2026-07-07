import { useState } from 'react';
import { ColorPicker } from '@/lib/color-picker';
import { DocSection } from '@/components/docs/DocSection';
import { DemoCard } from '@/components/docs/DemoCard';
import { CodeBlock } from '@/components/demo/CodeBlock';
import {
  installCode,
  basicUsageCode,
  nextAppCode,
  nextPagesCode,
  viteCode,
  oklchCode,
} from '@/site-data/getting-started-snippets';

const BasicDemo = () => {
  const [color, setColor] = useState('#6366F1');
  return <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />;
};

const BROWSERS = [
  ['Chrome / Edge', '88+'],
  ['Firefox', '87+'],
  ['Safari', '15+'],
  ['Node.js (SSR / build)', '20+'],
];

export default function GettingStartedDoc() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          ChromaKit is a zero-dependency React color picker with first-class
          support for OKLCH, OKLAB, and every traditional color space. Install
          it, import the stylesheet, and render.
        </p>
      </div>

      <DocSection
        id="installation"
        title="Installation"
        description="ChromaKit ships as an ES module with bundled TypeScript types."
      >
        <CodeBlock code={installCode} language="bash" />
      </DocSection>

      <DocSection
        id="basic-usage"
        title="Basic usage"
        description="Import the component and its stylesheet, then wire it to state. onChange receives a ColorValue with every format pre-converted."
      >
        <DemoCard code={basicUsageCode}>
          <BasicDemo />
        </DemoCard>
      </DocSection>

      <DocSection
        id="framework-setup"
        title="Framework setup"
        description="ChromaKit works in any React app. It renders on the client, so server frameworks need the picker loaded client-side."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Next.js App Router</h3>
            <p className="text-sm text-muted-foreground">
              Mark the component with <code>&apos;use client&apos;</code>.
            </p>
            <CodeBlock code={nextAppCode} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Next.js Pages Router (SSR)</h3>
            <p className="text-sm text-muted-foreground">
              Load it dynamically with <code>ssr: false</code>.
            </p>
            <CodeBlock code={nextPagesCode} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Vite / Create React App</h3>
            <p className="text-sm text-muted-foreground">
              Works out of the box.
            </p>
            <CodeBlock code={viteCode} />
          </div>
        </div>
      </DocSection>

      <DocSection
        id="why-oklch"
        title="Why OKLCH?"
        description="OKLCH is perceptually uniform — equal numeric changes produce equal visual differences, which HSL cannot promise."
      >
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Predictable lightness</strong> —
            a given L looks equally bright at every hue.
          </li>
          <li>
            <strong className="text-foreground">Smoother gradients</strong> — no
            muddy middle tones between two colors.
          </li>
          <li>
            <strong className="text-foreground">Consistent scales</strong> —
            generate tonal palettes with uniform visual weight.
          </li>
          <li>
            <strong className="text-foreground">Wider gamut</strong> — reach more
            vivid colors on modern displays.
          </li>
        </ul>
        <CodeBlock code={oklchCode} />
      </DocSection>

      <DocSection
        id="browser-support"
        title="Browser support"
        description="ChromaKit runs everywhere modern React runs. CSS oklch() output is only needed by your app if you render the string — the picker computes OKLCH in JS regardless."
      >
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-2.5 font-semibold">Environment</th>
                <th className="px-4 py-2.5 font-semibold">Minimum version</th>
              </tr>
            </thead>
            <tbody>
              {BROWSERS.map(([name, version]) => (
                <tr key={name} className="border-t border-border">
                  <td className="px-4 py-2.5">{name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
    </>
  );
}
