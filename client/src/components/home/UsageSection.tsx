import { CodeBlock } from '@/components/demo/CodeBlock';

// ============================================================
// CODE EXAMPLES
// ============================================================

const basicUsageCode = `import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';
import { useState } from 'react';

function App() {
  const [color, setColor] = useState('#7c3aed');
  
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
  useColorState
} from 'chromakit-react';

function CustomPicker() {
  const { hsva, colorValue, updateColor } = useColorState('#7c3aed');
  
  return (
    <div className="space-y-4">
      <ColorArea hsva={hsva} onChange={updateColor} />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
    </div>
  );
}`;

// ============================================================
// MAIN USAGE SECTION
// ============================================================

export function UsageSection() {
  return (
    <section id="usage" className="relative py-16 md:py-24">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Quick Start
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in seconds with zero configuration
            </p>
            <p className="text-sm text-muted-foreground">
              For complete API documentation and advanced usage, visit the{' '}
              <a
                href="https://www.npmjs.com/package/chromakit-react"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                NPM documentation →
              </a>
            </p>
          </div>

          {/* Examples */}
          <div className="grid gap-8">
            {/* Basic Usage */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Basic Usage</h3>
              <CodeBlock code={basicUsageCode} language="typescript" />
            </div>

            {/* Custom Components */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Build Your Own</h3>
              <p className="text-muted-foreground">
                Compose custom pickers with individual components for complete control
              </p>
              <CodeBlock code={customComponentsCode} language="typescript" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
