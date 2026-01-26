import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================================
// FINAL CTA COMPONENT
// ============================================================

export function FinalCTA() {
  const [copied, setCopied] = useState(false);
  const installCommand = 'npm install chromakit-react';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* HEADING */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Ready to Build Beautiful Color Pickers?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join developers building modern design systems with OKLCH
            </p>
          </div>

          {/* INSTALL COMMAND */}
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/50 border border-border max-w-lg mx-auto">
            <code className="font-mono text-sm flex-1 text-left">{installCommand}</code>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-background/80 transition-colors"
              aria-label="Copy install command"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="text-base px-8">
              <a href="#demo">Try Interactive Demo</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <a
                href="https://github.com/garrettsiegel/chromakit"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
