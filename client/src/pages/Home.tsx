import { useState, useCallback } from 'react';
import { Palette, Sparkles, Zap, Code2, Layers, Heart } from 'lucide-react';
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
    title: "Colors That Look Great Everywhere",
    description: "OKLCH color space ensures your color palettes look consistent across devices. No more muddy gradients or unexpected lightness changes."
  },
  {
    icon: Sparkles,
    title: "Works Perfectly With Your Design System",
    description: "Style every aspect of the picker with CSS variables or compose your own from primitives. Tailwind, CSS Modules, styled-components—use what you love."
  },
  {
    icon: Zap,
    title: "Smooth as Butter Interactions",
    description: "Canvas-based rendering with optimized updates delivers 60fps interactions your users will love. No jank, no lag."
  },
  {
    icon: Layers,
    title: "Build Exactly the Picker You Need",
    description: "Mix and match ColorArea, HueSlider, AlphaSlider and inputs to create custom pickers in minutes, not days."
  },
  {
    icon: Code2,
    title: "TypeScript-First Developer Experience",
    description: "Comprehensive types for all color formats and components. IntelliSense that actually helps. Catch bugs before they ship."
  },
  {
    icon: Palette,
    title: "Ship Faster With Pre-Built Themes",
    description: "Pre-built color themes and easy palette management for rapid prototyping. From concept to production in minutes."
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
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 shadow-md ring-1 ring-black/10" />
            <h1 className="text-xl font-bold">ChromaKit</h1>
            <Badge variant="secondary" className="text-xs">v0.1.0</Badge>
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

      {/* HERO SECTION - Full Width */}
      <section className="relative text-center mb-24 py-32 md:py-40 overflow-hidden">
        {/* Floating Gradient Orbs */}
        <div 
          className="gradient-orb gradient-orb-1 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/25 to-amber-500/25 -top-32 left-0"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgb(249 115 22 / 0.25), rgb(245 158 11 / 0.25)), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3' /%3E%3C/svg%3E")`
          }}
        />
        <div 
          className="gradient-orb gradient-orb-2 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/25 to-cyan-500/25 -top-20 right-0"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgb(59 130 246 / 0.25), rgb(6 182 212 / 0.25)), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3' /%3E%3C/svg%3E")`
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <Badge className="mb-8">Modern Color Picker for React</Badge>
          <h2 
            className="font-bold tracking-tight mb-8 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 bg-clip-text text-transparent"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              lineHeight: '1.1',
            }}
          >
            The Color Picker React Developers Love
          </h2>
          <p className="text-xl text-muted-foreground max-w-[40rem] mx-auto mb-16 leading-[1.6]">
            Modern color spaces (OKLCH/OKLAB) • 8KB gzipped • TypeScript-first • Built for design systems • Accessible by default
          </p>
          
          {/* Install Command with Terminal Style */}
          <div className="inline-block mb-10">
            <div className="terminal-window inline-flex items-center gap-3 px-6 py-4 bg-secondary/80 rounded-lg font-mono text-sm border border-border/50 shadow-lg backdrop-blur-sm">
              <span className="text-green-500 font-bold">$</span>
              <span>npm install chromakit</span>
              <CopyButton text="npm install chromakit" />
            </div>
          </div>

          {/* Trust Bar with Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Open Source
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> 8KB gzipped
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              WCAG AA
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              MIT License
            </Badge>
          </div>

          <div className="flex justify-center gap-4">
            <Button size="lg" className="shadow-lg" asChild data-testid="button-get-started">
              <a href="https://github.com/garrettsiegel/chromakit#readme" target="_blank" rel="noopener noreferrer">
                Get Started
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-view-github">
              <a href="https://github.com/garrettsiegel/chromakit" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-12">
        {/* Section Divider */}
        <div className="section-divider" />

        {/* FEATURES SECTION */}
        <section id="features" className="mb-32">
          <h3 className="text-4xl font-bold text-center mb-4">Features</h3>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            Everything you need to build beautiful color experiences
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* WHY CHROMAKIT SECTION */}
        <section className="mb-32">
          <h3 className="text-4xl font-bold text-center mb-4">Why ChromaKit?</h3>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Built for modern web development with the features you need and the performance you expect
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg overflow-hidden shadow-soft noise-texture">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold bg-primary/5">ChromaKit</th>
                  <th className="text-center p-4 font-semibold text-muted-foreground">react-colorful</th>
                  <th className="text-center p-4 font-semibold text-muted-foreground">react-color</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4">Bundle Size</td>
                  <td className="p-4 text-center font-semibold text-primary bg-primary/5">8KB</td>
                  <td className="p-4 text-center text-muted-foreground">3KB</td>
                  <td className="p-4 text-center text-muted-foreground">25KB</td>
                </tr>
                <tr className="border-t border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  <td className="p-4">OKLCH Support</td>
                  <td className="p-4 text-center bg-primary/5"><span className="text-green-500 font-bold text-xl">✓</span></td>
                  <td className="p-4 text-center"><span className="text-red-500 text-xl">✗</span></td>
                  <td className="p-4 text-center"><span className="text-red-500 text-xl">✗</span></td>
                </tr>
                <tr className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4">TypeScript</td>
                  <td className="p-4 text-center bg-primary/5"><span className="text-green-500 font-bold">✓ Native</span></td>
                  <td className="p-4 text-center text-muted-foreground">✓</td>
                  <td className="p-4 text-center text-muted-foreground">Partial</td>
                </tr>
                <tr className="border-t border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  <td className="p-4">Composable</td>
                  <td className="p-4 text-center bg-primary/5"><span className="text-green-500 font-bold text-xl">✓</span></td>
                  <td className="p-4 text-center"><span className="text-red-500 text-xl">✗</span></td>
                  <td className="p-4 text-center"><span className="text-red-500 text-xl">✗</span></td>
                </tr>
                <tr className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4">Dark Mode</td>
                  <td className="p-4 text-center bg-primary/5"><span className="text-green-500 font-bold">✓ Built-in</span></td>
                  <td className="p-4 text-center text-muted-foreground">Manual</td>
                  <td className="p-4 text-center text-muted-foreground">Manual</td>
                </tr>
                <tr className="border-t border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  <td className="p-4">Accessibility</td>
                  <td className="p-4 text-center bg-primary/5"><span className="text-green-500 font-bold">WCAG AA</span></td>
                  <td className="p-4 text-center text-muted-foreground">Basic</td>
                  <td className="p-4 text-center text-muted-foreground">Limited</td>
                </tr>
                <tr className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4">Customization</td>
                  <td className="p-4 text-center bg-primary/5"><span className="text-green-500 font-bold">Full CSS</span></td>
                  <td className="p-4 text-center text-muted-foreground">Limited</td>
                  <td className="p-4 text-center text-muted-foreground">Inline only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* DEMO SECTION */}
        <section id="demo" className="mb-32">
          <h3 className="text-4xl font-bold text-center mb-4">Interactive Demo</h3>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            Try it yourself and see how easy it is to work with
          </p>
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
        <section className="mb-32">
          <ThemePalettes />
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* USAGE SECTION */}
        <section id="usage" className="mb-32">
          <h3 className="text-4xl font-bold text-center mb-4">Usage</h3>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            Simple, powerful API that just works
          </p>
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

      {/* Section Divider before Footer */}
      <div className="container mx-auto px-4">
        <div className="section-divider" />
      </div>

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
                  <a href="https://github.com/garrettsiegel/chromakit#readme" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="https://github.com/garrettsiegel/chromakit#api" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="https://github.com/garrettsiegel/chromakit#examples" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Examples
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-sm">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/garrettsiegel/chromakit" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://github.com/garrettsiegel/chromakit/issues" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Issues
                  </a>
                </li>
                <li>
                  <a href="https://github.com/garrettsiegel/chromakit/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Discussions
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://www.npmjs.com/package/chromakit" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    NPM Package
                  </a>
                </li>
                <li>
                  <a href="https://github.com/garrettsiegel/chromakit/releases" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="https://github.com/garrettsiegel/chromakit/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/garrettDoesCode" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-foreground transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
