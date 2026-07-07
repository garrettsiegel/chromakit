import { Link, useRoute } from 'wouter';
import { cn } from '@/lib/utils';
import { DOCS } from './docs-nav';

const useActiveSlug = () => {
  const [, params] = useRoute('/docs/:slug');
  return params?.slug;
};

export const DocsSidebar = () => {
  const active = useActiveSlug();
  return (
    <aside className="hidden md:block w-56 shrink-0">
      <nav className="sticky top-24 space-y-1">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Documentation
        </p>
        {DOCS.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className={cn(
              'block rounded-lg px-3 py-2 text-sm transition-colors',
              active === doc.slug
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            {doc.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export const DocsMobileNav = () => {
  const active = useActiveSlug();
  return (
    <nav className="md:hidden sticky top-[73px] z-40 -mx-6 mb-6 flex gap-2 overflow-x-auto border-b border-border bg-background/80 px-6 py-3 backdrop-blur-xl">
      {DOCS.map((doc) => (
        <Link
          key={doc.slug}
          href={`/docs/${doc.slug}`}
          className={cn(
            'whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors',
            active === doc.slug
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {doc.title}
        </Link>
      ))}
    </nav>
  );
};
