import { Suspense, useEffect } from 'react';
import { Redirect, useRoute } from 'wouter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { DOCS, DEFAULT_DOC_SLUG } from './docs-nav';
import { DocsSidebar, DocsMobileNav } from './DocsSidebar';

export default function DocsPage() {
  const [, params] = useRoute('/docs/:slug');
  const slug = params?.slug;
  const entry = DOCS.find((doc) => doc.slug === slug);

  useEffect(() => {
    if (entry) {
      document.title = `${entry.title} · ChromaKit Docs`;
      window.scrollTo(0, 0);
    }
  }, [entry]);

  if (!entry) {
    return <Redirect to={`/docs/${DEFAULT_DOC_SLUG}`} replace />;
  }

  const Content = entry.Component;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-6 py-10">
        <DocsMobileNav />
        <div className="flex gap-10">
          <DocsSidebar />
          <main className="min-w-0 flex-1 max-w-3xl space-y-16 pb-16">
            <Suspense
              fallback={
                <div className="text-muted-foreground">Loading…</div>
              }
            >
              <Content />
            </Suspense>
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
