import { useState, useCallback } from 'react';
import { Palette, Sparkles, Zap, Code2, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ColorPicker, type ColorValue } from '@/lib/color-picker';
import { CopyButton } from '@/components/demo/CopyButton';
import { CodeBlock } from '@/components/demo/CodeBlock';
import { ColorFormatsDisplay } from '@/components/demo/ColorFormatsDisplay';
import { FeatureCard } from '@/components/demo/FeatureCard';
import { CustomPickerDemo } from '@/components/demo/CustomPickerDemo';
import { ThemePalettes } from '@/components/demo/ThemePalettes';

const FEATURES = [
  {
    icon: Palette,
    title: "Modern Color Spaces",
    description: "Support for OKLCH, OKLAB, HSL, RGB, HEX and more. Perceptually uniform color manipulation."
  },
  {
    icon: Sparkles,
    title: "Fully Customizable",
    description: "Style every aspect of the picker. Use CSS variables or compose your own from primitives."
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Canvas-based rendering with optimized updates. Smooth 60fps interactions."
  },
  {
    icon: Layers,
    title: "Composable Components",
    description: "Mix and match ColorArea, HueSlider, AlphaSlider and inputs to build custom pickers."
  },
  {
    icon: Code2,
    title: "TypeScript First",
    description: "Full TypeScript support with comprehensive types for all color formats and components."
  },
  {
    icon: Palette,
    title: "Theme Palettes",
    description: "Pre-built color themes and easy palette management for rapid prototyping."
  },
] as const;

const CODE_EXAMPLES = {
  basic: `import { ColorPicker } from '@chromakit/react';

function App() {
  const [color, setColor] = useState('#6366F1');
  
  return (
    <ColorPicker
      value={color}
      onChange={(colorValue) => setColor(colorValue.hex)}
      showAlpha
      showInputs
    />
  );
}`,
  custom: `import { 
  ColorArea, 
  HueSlider, 
  AlphaSlider,
  useColorState 
} from '@chromakit/react';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#FF5733');
  
  return (
    <div className="flex flex-col gap-4">
      <ColorArea hsva={hsva} onChange={updateColor} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
      <p>Selected: {colorValue.hex}</p>
    </div>
  );
}`,
  conversion: `import { 
  parseColor, 
  rgbaToColorValue,
  formatColor 
} from '@chromakit/react';

// Parse any color format
const rgba = parseColor('#FF5733');
const colorValue = rgbaToColorValue(rgba);

// Get any format you need
console.log(formatColor(colorValue, 'oklch'));
// oklch(63.4% 0.193 36.2)

console.log(formatColor(colorValue, 'hsl'));
// hsl(10, 100%, 60%)`,
} as const;

export default function Home() {
  const [demoColor, setDemoColor] = useState<ColorValue | null>(null);

  const handleColorChange = useCallback((color: ColorValue) => {
    setDemoColor(color);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header 
        className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background) / 0.95))',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-500 via-pink-500 to-orange-500 shadow-md ring-1 ring-black/10" />
            <h1 className="text-xl font-bold">ChromaKit</h1>
            <Badge variant="secondary" className="text-xs">v1.0.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="#features" 
              className="inline-flex items-center justify-center min-h-8 px-3 text-sm rounded-md border border-transparent hover-elevate active-elevate-2 transition-all focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-features"
            >
              Features
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
              Usage
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-12">
        {/* HERO SECTION */}
        <section className="text-center mb-16">
          <Badge className="mb-4">Modern Color Picker for React</Badge>
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-4 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            ChromaKit
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A beautiful, customizable React color picker with support for modern color spaces like OKLCH, 
            OKLAB, plus traditional RGB, HSL, and HEX formats. Performant, accessible, and easy to style.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" data-testid="button-get-started">
              Get Started
            </Button>
            <Button variant="outline" size="lg" data-testid="button-view-github">
              View on GitHub
            </Button>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </section>

        {/* DEMO SECTION */}
        <section id="demo" className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Interactive Demo</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Full Color Picker</CardTitle>
                  <CardDescription>
                    The complete picker with all features enabled
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ColorPicker
                    defaultValue="#6366F1"
                    onChange={handleColorChange}
                    showAlpha
                    showInputs
                    showPreview
                    width={320}
                  />
                </CardContent>
              </Card>
              
              {!demoColor ? (
                <Card className="opacity-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Output Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-10 bg-secondary/30 rounded-md animate-pulse" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Output Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ColorFormatsDisplay colorValue={demoColor} />
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              <CustomPickerDemo />
            </div>
          </div>
        </section>

        {/* THEME PALETTES SECTION */}
        <section className="mb-16">
          <ThemePalettes />
        </section>

        {/* USAGE SECTION */}
        <section id="usage" className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Usage</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Usage</CardTitle>
                <CardDescription>
                  Get started with the full-featured ColorPicker component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={CODE_EXAMPLES.basic} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Components</CardTitle>
                <CardDescription>
                  Build your own picker using individual primitives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={CODE_EXAMPLES.custom} />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Color Conversions</CardTitle>
                <CardDescription>
                  Use the conversion utilities to work with any color format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={CODE_EXAMPLES.conversion} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="text-center py-12 border-t border-border">
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-6">
            Install ChromaKit and start building beautiful color experiences.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-md font-mono text-sm">
            <span>npm install chromakit</span>
            <CopyButton text="npm install chromakit" />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>ChromaKit - Modern Color Picker for React</p>
          <p>2026 - Garrett Siegel</p>
        </div>
      </footer>
    </div>
  );
}
