import type { ReactNode } from 'react';
import { DocSection } from '@/components/docs/DocSection';
import { CodeBlock } from '@/components/demo/CodeBlock';

interface Issue {
  id: string;
  title: string;
  body: ReactNode;
  code?: string;
  language?: 'tsx' | 'typescript' | 'bash' | 'css';
}

const issues: Issue[] = [
  {
    id: 'styles',
    title: 'The picker renders unstyled',
    body: 'The stylesheet is a separate import. Add it once, anywhere in your app:',
    code: `import 'chromakit-react/chromakit.css';`,
  },
  {
    id: 'ssr',
    title: 'Next.js: "window is not defined"',
    body: 'The picker is a client component. In the App Router add the "use client" directive; in the Pages Router load it dynamically with SSR disabled:',
    code: `import dynamic from 'next/dynamic';

const ColorPicker = dynamic(
  () => import('chromakit-react').then((m) => m.ColorPicker),
  { ssr: false }
);`,
  },
  {
    id: 'history',
    title: 'Recent colors are not persisting',
    body: (
      <>
        History is stored in <code>localStorage</code> under the key{' '}
        <code>chromakit-color-history</code>. It will not persist in private /
        incognito windows, and requires <code>enableHistory</code> (on by
        default). Clear it manually with:
      </>
    ),
    code: `import { clearColorHistory } from 'chromakit-react';
clearColorHistory();`,
  },
  {
    id: 'types',
    title: 'TypeScript errors on the onChange color',
    body: (
      <>
        <code>onChange</code> and <code>onChangeComplete</code> receive a{' '}
        <code>ColorValue</code>, which carries every format at once — read the
        one you need:
      </>
    ),
    code: `import type { ColorValue } from 'chromakit-react';

const handleChange = (color: ColorValue) => {
  console.log(color.hex, color.oklch);
};`,
    language: 'typescript',
  },
];

const typeExportsCode = `import type {
  // Color format types
  RGB, RGBA,
  HSL, HSLA,
  HSV, HSVA,
  OKLAB, OKLABA,
  OKLCH, OKLCHA,

  // Core types
  ColorFormat,
  ColorValue,

  // Component & preset types
  ColorPickerProps,
  PresetGroup,
  PresetGroupsInput,
} from 'chromakit-react';`;

export default function TroubleshootingDoc() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Troubleshooting</h1>
        <p className="text-lg text-muted-foreground">
          The handful of gotchas people hit most often, and the exported types
          for when you want full type safety.
        </p>
      </div>

      {issues.map((issue) => (
        <DocSection key={issue.id} id={issue.id} title={issue.title}>
          <p className="text-muted-foreground leading-relaxed">{issue.body}</p>
          {issue.code ? (
            <CodeBlock code={issue.code} language={issue.language ?? 'tsx'} />
          ) : null}
        </DocSection>
      ))}

      <DocSection
        id="type-exports"
        title="Type exports"
        description="ChromaKit is written in TypeScript and ships its declarations. Every public type is importable:"
      >
        <CodeBlock code={typeExportsCode} language="typescript" />
      </DocSection>
    </>
  );
}
