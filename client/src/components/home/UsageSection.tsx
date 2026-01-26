import { Card } from '@/components/ui/card';
import { CodeBlock } from '@/components/demo/CodeBlock';
import { Badge } from '@/components/ui/badge';

// ============================================================
// CODE EXAMPLES
// ============================================================

const basicUsageCode = `import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';
import { useState } from 'react';

function App() {
  const [color, setColor] = useState('#ff6b35');
  
  return (
    <ColorPicker 
      value={color} 
      onChange={(colorValue) => setColor(colorValue.hex)} 
    />
  );
}`;

const customComponentsCode = `import { 
  ColorArea, 
  HueSlider, 
  AlphaSlider,
  ColorPreview,
  useColorState
} from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#ff6b35');
  
  return (
    <div className="space-y-4">
      <ColorArea hsva={hsva} onChange={updateColor} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
      <ColorPreview colorValue={colorValue} />
    </div>
  );
}`;

const advancedOptionsCode = `import { ColorPicker } from 'chromakit-react';

// Disable eyedropper and copy buttons
<ColorPicker 
  value={color} 
  onChange={(c) => setColor(c.hex)}
  showEyeDropper={false}
  showCopyButton={false}
/>

// Custom width and hide presets
<ColorPicker 
  value={color}
  onChange={(c) => setColor(c.hex)}
  width={300}
  showPresets={false}
/>

// Only show specific formats
<ColorPicker 
  value={color}
  onChange={(c) => setColor(c.hex)}
  formats={['hex', 'oklch']}
/>`;

const colorConversionsCode = `import { oklch, hex, rgb, hsl } from 'chromakit-react';

// Convert HEX to OKLCH
const oklchColor = oklch('#ff6b35');
console.log(oklchColor); 
// { l: 0.68, c: 0.18, h: 29, alpha: 1 }

// Convert OKLCH to HEX
const hexColor = hex({ l: 0.68, c: 0.18, h: 29, alpha: 1 });
console.log(hexColor); // '#ff6b35'

// Convert to RGB
const rgbColor = rgb('#ff6b35');
console.log(rgbColor); // { r: 255, g: 107, b: 53, alpha: 1 }

// Convert to HSL
const hslColor = hsl('#ff6b35');
console.log(hslColor); // { h: 16, s: 100, l: 60, alpha: 1 }`;

// ============================================================
// EXAMPLE CARD COMPONENT
// ============================================================

interface ExampleCardProps {
  title: string;
  description: string;
  code: string;
  badge?: string;
  fullWidth?: boolean;
}

function ExampleCard({ title, description, code, badge, fullWidth }: ExampleCardProps) {
  return (
    <Card className={`overflow-hidden ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="p-6 space-y-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge && <Badge variant="outline">{badge}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <CodeBlock code={code} language="tsx" />
    </Card>
  );
}

// ============================================================
// MAIN USAGE SECTION
// ============================================================

export function UsageSection() {
  return (
    <section id="usage" className="relative py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* HEADING */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mb-4">
              Quick Start
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Get Started in Seconds
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple API with powerful customization options
            </p>
          </div>

          {/* CODE EXAMPLES GRID */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ExampleCard
              title="Basic Usage"
              description="The simplest way to add a color picker to your React app"
              code={basicUsageCode}
              badge="Recommended"
            />

            <ExampleCard
              title="Custom Components"
              description="Build your own picker with composable primitives"
              code={customComponentsCode}
            />

            <ExampleCard
              title="Advanced Options"
              description="Customize visibility and behavior with props"
              code={advancedOptionsCode}
            />

            <ExampleCard
              title="Color Conversions"
              description="Utility functions for converting between color formats"
              code={colorConversionsCode}
              fullWidth
            />
          </div>

          {/* ADDITIONAL INFO */}
          <div className="text-center pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Need more examples? Check out the full documentation
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/garrettsiegel/chromakit#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Documentation →
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="https://github.com/garrettsiegel/chromakit/tree/main/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Browse Examples →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
