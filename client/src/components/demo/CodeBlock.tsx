import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language: _language = 'tsx' }: CodeBlockProps) {
  return (
    <div className="relative group terminal-window">
      <pre 
        className="p-4 bg-secondary/50 rounded-md overflow-x-auto text-sm font-mono relative border border-border/50"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\' /%3E%3C/svg%3E")',
        }}
      >
        <code>{code}</code>
      </pre>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <CopyButton text={code} />
      </div>
    </div>
  );
}
