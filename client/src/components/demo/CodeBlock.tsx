import { memo } from 'react';
import { Highlight, themes, type Language } from 'prism-react-renderer';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: Language;
}

export const CodeBlock = memo(function CodeBlock({
  code,
  language = 'tsx',
}: CodeBlockProps) {
  return (
    <div className="relative group terminal-window">
      <Highlight theme={themes.oneDark} code={code.trim()} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="p-4 bg-[#282c34] text-[#abb2bf] rounded-md overflow-x-auto text-sm font-mono relative border border-border/50 noise-texture">
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <CopyButton text={code.trim()} />
      </div>
    </div>
  );
});
