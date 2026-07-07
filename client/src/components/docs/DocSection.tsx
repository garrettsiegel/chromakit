import type { ReactNode } from 'react';

interface DocSectionProps {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export const DocSection = ({
  id,
  title,
  description,
  children,
}: DocSectionProps) => {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
};
