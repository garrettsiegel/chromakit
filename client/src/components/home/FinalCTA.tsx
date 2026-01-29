import { useState } from 'react';
import { Copy, Check, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Start Building Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Join developers building modern design systems with OKLCH
            </p>
          </div>

          {/* Install Command */}
          <div className="inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-border bg-card">
            <code className="font-mono text-sm flex-1 text-left">
              {installCommand}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Copy install command"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 h-12" asChild>
              <a
                href="https://www.npmjs.com/package/chromakit-react"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read Full Documentation
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 group" asChild>
              <a href="#demo">
                Try Interactive Demo
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 h-12"
              asChild
            >
              <a
                href="https://github.com/garrettsiegel/chromakit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
