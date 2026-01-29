import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { DemoPlayground } from '@/components/home/DemoPlayground';
import { UsageSection } from '@/components/home/UsageSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import packageJson from '../../../package.json';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-violet-500 to-pink-500" />
            <h1 className="text-xl font-bold">ChromaKit</h1>
            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
              v{packageJson.version}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Demo
            </a>
            <a
              href="https://www.npmjs.com/package/chromakit-react"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Docs
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* HERO */}
      <HeroSection />

      {/* FEATURES */}
      <FeaturesSection />

      {/* DEMO */}
      <DemoPlayground />

      {/* USAGE */}
      <UsageSection />

      {/* FINAL CTA */}
      <FinalCTA />

      {/* FOOTER */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Description */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-violet-500 to-pink-500" />
              <div>
                <div className="font-bold">ChromaKit</div>
                <p className="text-sm text-muted-foreground">
                  Modern color picker for React
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://github.com/garrettsiegel/chromakit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/chromakit-react"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Documentation
              </a>
              <a
                href="https://github.com/garrettsiegel/chromakit/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                MIT License
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/garrettsiegel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="https://x.com/garrettDoesCode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X / Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
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
