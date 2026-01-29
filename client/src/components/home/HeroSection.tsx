import { useState, useCallback, memo } from 'react';
import { Copy, Check, ArrowRight, Github, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ColorShowcase = memo(function ColorShowcase() {
  const colors = [
    { oklch: 'oklch(0.75 0.20 330)', label: 'Pink' },
    { oklch: 'oklch(0.70 0.25 30)', label: 'Orange' },
    { oklch: 'oklch(0.80 0.15 140)', label: 'Green' },
    { oklch: 'oklch(0.65 0.25 260)', label: 'Blue' },
    { oklch: 'oklch(0.70 0.20 200)', label: 'Cyan' },
  ];

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      {colors.map((color, i) => (
        <div
          key={i}
          className="group relative"
        >
          <div
            className="w-20 h-20 rounded-2xl border-2 border-border transition-transform duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer"
            style={{ backgroundColor: color.oklch }}
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-muted-foreground whitespace-nowrap">{color.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

const InstallCommand = memo(function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = 'npm install chromakit-react';

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [command]);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
      <code className="font-mono text-sm text-foreground">{command}</code>
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        aria-label="Copy install command"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
});

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Perceptual Color Science for React
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            The Modern Color Picker
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              for Design Systems
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built with OKLCH for perceptually uniform colors. Composable components.
            Zero dependencies. Built for React 19.
          </p>

          {/* Color Showcase */}
          <ColorShowcase />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="text-base px-8 h-12 group" asChild>
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

          {/* Install Command */}
          <div className="pt-4">
            <InstallCommand />
          </div>
        </div>
      </div>
    </section>
  );
}
