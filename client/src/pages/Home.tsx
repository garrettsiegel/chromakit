import { useState, useCallback } from 'react';
import { Copy, Check, Palette, Sparkles, Zap, Code2, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ColorPicker,
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
  PresetColors,
  RGBInputs,
  HSLInputs,
  HSVInputs,
  OKLCHInputs,
  useColorState,
  formatColor,
  type ColorValue,
  type ColorFormat,
} from '@/lib/color-picker';

const THEME_PRESETS = {
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#957DAD', '#D4A5A5'],
  dark: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483', '#2C3E50', '#34495E', '#5D6D7E'],
  nature: ['#2D5A27', '#4A7C59', '#6B8E23', '#9ACD32', '#556B2F', '#8B4513', '#D2691E', '#CD853F'],
  ocean: ['#006994', '#0077B6', '#00B4D8', '#48CAE4', '#90E0EF', '#023E8A', '#03045E', '#ADE8F4'],
};

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={className}
      data-testid="button-copy"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

function CodeBlock({ code, language = 'tsx' }: { code: string; language?: string }) {
  return (
    <div className="relative group">
      <pre className="p-4 bg-secondary/50 rounded-md overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

function ColorFormatsDisplay({ colorValue }: { colorValue: ColorValue }) {
  const formats: ColorFormat[] = ['hex', 'rgb', 'rgba', 'hsl', 'hsla', 'oklch', 'oklcha'];
  
  return (
    <div className="grid gap-2">
      {formats.map((format) => {
        const formatted = formatColor(colorValue, format);
        return (
          <div
            key={format}
            className="flex items-center justify-between gap-2 p-2 bg-secondary/30 rounded-md"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase w-16">
              {format}
            </span>
            <code className="flex-1 text-xs font-mono truncate">{formatted}</code>
            <CopyButton text={formatted} />
          </div>
        );
      })}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Palette;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function CustomPickerDemo() {
  const {
    hsva,
    colorValue,
    updateColor,
    setFromString,
    startDrag,
    endDrag,
  } = useColorState('#6366F1');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Build Your Own Picker</CardTitle>
        <CardDescription>
          Compose individual components to create a custom color picker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          <ColorArea
            hsva={hsva}
            onChange={updateColor}
            onStart={startDrag}
            onEnd={endDrag}
            width={320}
            height={160}
          />
          <div className="flex gap-4 items-start">
            <ColorPreview colorValue={colorValue} size="lg" />
            <div className="flex-1 space-y-3">
              <HueSlider
                hsva={hsva}
                onChange={updateColor}
                onStart={startDrag}
                onEnd={endDrag}
              />
              <AlphaSlider
                hsva={hsva}
                onChange={updateColor}
                onStart={startDrag}
                onEnd={endDrag}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="rgb" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="rgb" className="flex-1">RGB</TabsTrigger>
            <TabsTrigger value="hsl" className="flex-1">HSL</TabsTrigger>
            <TabsTrigger value="hsv" className="flex-1">HSV</TabsTrigger>
            <TabsTrigger value="oklch" className="flex-1">OKLCH</TabsTrigger>
          </TabsList>
          <TabsContent value="rgb" className="mt-4">
            <RGBInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
          <TabsContent value="hsl" className="mt-4">
            <HSLInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
          <TabsContent value="hsv" className="mt-4">
            <HSVInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
          <TabsContent value="oklch" className="mt-4">
            <OKLCHInputs colorValue={colorValue} onChange={setFromString} />
          </TabsContent>
        </Tabs>

        <ColorFormatsDisplay colorValue={colorValue} />
      </CardContent>
    </Card>
  );
}

function ThemePalettes() {
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEME_PRESETS>('vibrant');
  const [selectedColor, setSelectedColor] = useState(THEME_PRESETS.vibrant[0]);
  const {
    colorValue,
    setFromString,
  } = useColorState(selectedColor);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
    setFromString(color);
  }, [setFromString]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Theme Palettes</CardTitle>
        <CardDescription>
          Pre-built color themes for quick prototyping
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(THEME_PRESETS) as Array<keyof typeof THEME_PRESETS>).map((theme) => (
            <Button
              key={theme}
              variant={selectedTheme === theme ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedTheme(theme);
                handleColorSelect(THEME_PRESETS[theme][0]);
              }}
              data-testid={`theme-button-${theme}`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Button>
          ))}
        </div>
        
        <PresetColors
          colors={THEME_PRESETS[selectedTheme]}
          selectedColor={selectedColor}
          onSelect={handleColorSelect}
        />

        <div className="p-4 bg-secondary/30 rounded-md space-y-3">
          <div className="flex items-center gap-3">
            <ColorPreview colorValue={colorValue} size="md" />
            <div>
              <p className="font-medium">{colorValue.hex}</p>
              <p className="text-sm text-muted-foreground">
                oklch({(colorValue.oklch.L * 100).toFixed(0)}% {colorValue.oklch.C.toFixed(2)} {colorValue.oklch.h.toFixed(0)})
              </p>
            </div>
          </div>
          <ColorFormatsDisplay colorValue={colorValue} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [demoColor, setDemoColor] = useState<ColorValue | null>(null);

  const handleColorChange = useCallback((color: ColorValue) => {
    setDemoColor(color);
  }, []);

  const basicUsageCode = `import { ColorPicker } from '@chromakit/react';

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
}`;

  const customComponentsCode = `import { 
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
}`;

  const colorConversionCode = `import { 
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
// hsl(10, 100%, 60%)`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-500 via-pink-500 to-orange-500" />
            <h1 className="text-xl font-bold">ChromaKit</h1>
            <Badge variant="secondary" className="text-xs">v1.0.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="#features" data-testid="link-features">Features</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#demo" data-testid="link-demo">Demo</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#usage" data-testid="link-usage">Usage</a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <Badge className="mb-4">Modern Color Picker for React</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
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

        <section id="features" className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Palette}
              title="Modern Color Spaces"
              description="Support for OKLCH, OKLAB, HSL, RGB, HEX and more. Perceptually uniform color manipulation."
            />
            <FeatureCard
              icon={Sparkles}
              title="Fully Customizable"
              description="Style every aspect of the picker. Use CSS variables or compose your own from primitives."
            />
            <FeatureCard
              icon={Zap}
              title="High Performance"
              description="Canvas-based rendering with optimized updates. Smooth 60fps interactions."
            />
            <FeatureCard
              icon={Layers}
              title="Composable Components"
              description="Mix and match ColorArea, HueSlider, AlphaSlider and inputs to build custom pickers."
            />
            <FeatureCard
              icon={Code2}
              title="TypeScript First"
              description="Full TypeScript support with comprehensive types for all color formats and components."
            />
            <FeatureCard
              icon={Palette}
              title="Theme Palettes"
              description="Pre-built color themes and easy palette management for rapid prototyping."
            />
          </div>
        </section>

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
              
              {demoColor && (
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

        <section className="mb-16">
          <ThemePalettes />
        </section>

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
                <CodeBlock code={basicUsageCode} />
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
                <CodeBlock code={customComponentsCode} />
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
                <CodeBlock code={colorConversionCode} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center py-12 border-t border-border">
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-6">
            Install ChromaKit and start building beautiful color experiences.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-md font-mono text-sm">
            <span>npm install @chromakit/react</span>
            <CopyButton text="npm install @chromakit/react" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>ChromaKit - Modern Color Picker for React</p>
          <p>2026 - Garrett Siegel</p>
        </div>
      </footer>
    </div>
  );
}
