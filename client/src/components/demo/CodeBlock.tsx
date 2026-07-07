import { memo } from 'react';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = memo(function CodeBlock({
  code,
  language: _language = 'tsx',
}: CodeBlockProps) {
  return (
    <div className="relative group terminal-window">
      <pre className="p-4 bg-secondary/50 rounded-md overflow-x-auto text-sm font-mono relative border border-border/50 noise-texture">
        <code>{code}</code>
      </pre>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <CopyButton text={code} />
      </div>
    </div>
  );
});
