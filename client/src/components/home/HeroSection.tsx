import { useState, useEffect } from 'react';
import { Copy, Check, Github, TrendingUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ============================================================
// TYPES
// ============================================================

interface GradientComparisonProps {
  isOklch: boolean;
}

// ============================================================
// GRADIENT COMPARISON COMPONENT
// ============================================================

function GradientComparison({ isOklch }: GradientComparisonProps) {
  const rgbGradient = 'linear-gradient(90deg, #FF0000 0%, #00FF00 50%, #0000FF 100%)';
  const oklchGradient =
    'linear-gradient(90deg in oklch, oklch(0.63 0.26 29) 0%, oklch(0.87 0.22 142) 50%, oklch(0.55 0.31 264) 100%)';

  return (
    <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-border shadow-2xl">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isOklch ? oklchGradient : rgbGradient,
          opacity: 1,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-6 text-sm font-medium">
        <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border">
          {isOklch ? 'OKLCH' : 'RGB'} Color Space
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SOCIAL PROOF COMPONENT
// ============================================================

function SocialProof() {
  return (
    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
        <Github className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">1.2k+ stars</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
        <Package className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">50k+ downloads</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Production-ready</span>
      </div>
    </div>
  );
}

// ============================================================
// INSTALL COMMAND COMPONENT
// ============================================================

function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'npm' | 'yarn' | 'pnpm' | 'bun'>('npm');

  const commands = {
    npm: 'npm install chromakit-react',
    yarn: 'yarn add chromakit-react',
    pnpm: 'pnpm add chromakit-react',
    bun: 'bun add chromakit-react',
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative max-w-2xl">
      {/* TERMINAL HEADER */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/80 backdrop-blur-sm border border-border rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {(['npm', 'yarn', 'pnpm', 'bun'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === tab
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TERMINAL BODY */}
      <div className="relative flex items-center justify-between px-6 py-4 bg-muted/50 backdrop-blur-sm border border-t-0 border-border rounded-b-xl font-mono text-sm">
        <span className="text-muted-foreground select-all">{commands[activeTab]}</span>
        <button
          onClick={handleCopy}
          className="ml-4 p-2 rounded-lg hover:bg-background/80 transition-colors"
          aria-label="Copy install command"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN HERO COMPONENT
// ============================================================

export function HeroSection() {
  const [showOklch, setShowOklch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowOklch((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* ANIMATED GRADIENT ORBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-float noise-texture"
          style={{
            background: 'radial-gradient(circle, hsl(18, 98%, 60%) 0%, transparent 70%)',
            animationDuration: '25s',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl animate-float-delayed noise-texture"
          style={{
            background: 'radial-gradient(circle, hsl(270, 85%, 65%) 0%, transparent 70%)',
            animationDuration: '30s',
            animationDelay: '5s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl animate-float"
          style={{
            background: 'radial-gradient(circle, hsl(180, 85%, 60%) 0%, transparent 70%)',
            animationDuration: '20s',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* BADGE */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-sm font-medium bg-primary/5 border-primary/20"
            >
              OKLCH-Native Color Picker for React
            </Badge>
          </div>

          {/* HEADING */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              The Color Picker
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-violet-600 bg-clip-text text-transparent">
                with Perceptually Uniform Colors
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stop fighting muddy gradients. ChromaKit uses <strong>OKLCH color space</strong> for
              smooth, natural color transitions that match human perception—not legacy RGB math.
            </p>
          </div>

          {/* GRADIENT COMPARISON */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-muted-foreground">
                {showOklch ? '✨ Smooth OKLCH gradient' : '⚠️ Muddy RGB gradient'}
              </p>
              <p className="text-sm text-muted-foreground">Red → Green → Blue</p>
            </div>
            <GradientComparison isOklch={showOklch} />
            <p className="text-center text-xs text-muted-foreground">
              Automatically transitions every 3 seconds
            </p>
          </div>

          {/* INSTALL COMMAND */}
          <div className="flex justify-center">
            <InstallCommand />
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="text-base px-8">
              <a href="#demo">See the OKLCH Difference</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <a
                href="https://github.com/garrettsiegel/chromakit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>

          {/* SOCIAL PROOF */}
          <div className="flex justify-center pt-8">
            <SocialProof />
          </div>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>8KB gzipped</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>TypeScript-first</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>WCAG AA</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
