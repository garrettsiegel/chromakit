import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroSection } from '@/components/home/HeroSection';
import { InteractiveComparison } from '@/components/home/InteractiveComparison';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { DemoPlayground } from '@/components/home/DemoPlayground';
import { MigrationCTA } from '@/components/home/MigrationCTA';
import { UsageSection } from '@/components/home/UsageSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import packageJson from '../../../package.json';

// ============================================================
// MAIN HOME PAGE COMPONENT
// ============================================================

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background) / 0.95))',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 shadow-md ring-1 ring-black/10" />
            <h1 className="text-xl font-bold">ChromaKit</h1>
            <Badge variant="secondary" className="text-xs">
              v{packageJson.version}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#comparison"
              className="inline-flex items-center justify-center min-h-8 px-3 text-sm rounded-md border border-transparent hover-elevate active-elevate-2 transition-all focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-comparison"
            >
              Why ChromaKit
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center min-h-8 px-3 text-sm rounded-md border border-transparent hover-elevate active-elevate-2 transition-all focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-demo"
            >
              Demo
            </a>
            <a
              href="#usage"
              className="inline-flex items-center justify-center min-h-8 px-3 text-sm rounded-md border border-transparent hover-elevate active-elevate-2 transition-all focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-usage"
            >
              Docs
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <HeroSection />

      {/* INTERACTIVE COMPARISON */}
      <InteractiveComparison />

      {/* FEATURES */}
      <FeaturesSection />

      {/* DEMO PLAYGROUND */}
      <DemoPlayground />

      {/* MIGRATION CTA */}
      <MigrationCTA />

      {/* USAGE/QUICK START */}
      <UsageSection />

      {/* FINAL CTA */}
      <FinalCTA />

      {/* FOOTER */}
      <footer className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400" />
                <span className="font-bold">ChromaKit</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern color picker for React with OKLCH support
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Documentation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit#readme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit#api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit#examples"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Examples
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Issues
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Discussions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://www.npmjs.com/package/chromakit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    NPM Package
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Changelog
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/garrettsiegel/chromakit/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    MIT License
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 ChromaKit • Built by Garrett Siegel</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/garrettsiegel"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="https://x.com/garrettDoesCode"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="X / Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <span className="hidden md:inline text-border">•</span>
              <Button
                variant="outline"
                size="sm"
                className="border-pink-500/50 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10"
                asChild
              >
                <a
                  href="https://github.com/sponsors/garrettsiegel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Sponsor
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
