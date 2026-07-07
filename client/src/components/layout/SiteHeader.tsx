import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinkClass =
  'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors';

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/favicon.png"
            alt="ChromaKit logo"
            className="w-8 h-8 rounded-lg"
          />
          <h1 className="text-xl font-bold">ChromaKit</h1>
          <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
            v{__PKG_VERSION__}
          </Badge>
        </Link>
        <div className="flex items-center gap-2">
          <a href="/#demo" className={navLinkClass}>
            Demo
          </a>
          <Link href="/docs" className={navLinkClass}>
            Docs
          </Link>
          <a
            href="https://github.com/garrettsiegel/chromakit"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
