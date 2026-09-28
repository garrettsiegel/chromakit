import type { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

interface DemoCardProps {
  label?: string;
  code?: ReactNode;
  children: ReactNode;
}

export const DemoCard = ({
  label = 'Default theme · chromakit.css',
  code,
  children,
}: DemoCardProps) => {
  const caption = <span className="demo-card__label">{label}</span>;
  const preview = <div className="demo-card__preview">{children}</div>;

  if (!code) {
    return (
      <div className="demo-card">
        <div className="demo-card__bar">{caption}</div>
        {preview}
      </div>
    );
  }

  return (
    <Tabs.Root className="demo-card" defaultValue="preview">
      <div className="demo-card__bar">
        <Tabs.List className="tabs__list" aria-label="Demo view">
          <Tabs.Trigger className="tabs__trigger" value="preview">
            Preview
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs__trigger" value="code">
            Code
          </Tabs.Trigger>
        </Tabs.List>
        {caption}
      </div>
      <Tabs.Content value="preview">{preview}</Tabs.Content>
      <Tabs.Content value="code">{code}</Tabs.Content>
    </Tabs.Root>
  );
};
