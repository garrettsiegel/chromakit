import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/demo/CodeBlock';

// ============================================================
// CODE EXAMPLES
// ============================================================

const beforeCode = `// react-colorful (RGB only)
import { HexColorPicker } from 'react-colorful';

function MyPicker() {
  const [color, setColor] = useState('#ff6b35');
  return <HexColorPicker color={color} onChange={setColor} />;
}`;

const afterCode = `// ChromaKit (OKLCH + all formats)
import { ColorPicker } from 'chromakit-react';
import 'chromakit-react/chromakit.css';

function MyPicker() {
  const [color, setColor] = useState('#ff6b35');
  return <ColorPicker value={color} onChange={(c) => setColor(c.hex)} />;
}`;

// ============================================================
// MAIN MIGRATION CTA COMPONENT
// ============================================================

export function MigrationCTA() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* HEADING */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mb-4">
              Drop-in Replacement
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Migrate in 2 Minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Already using{' '}
              <code className="text-sm bg-muted px-2 py-1 rounded">
                react-colorful
              </code>
              ? Switch to ChromaKit with zero breaking changes and instant OKLCH
              support.
            </p>
          </div>

          {/* BEFORE/AFTER COMPARISON */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* BEFORE */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  Before
                </Badge>
              </div>
              <CodeBlock code={beforeCode} language="tsx" />
            </Card>

            {/* AFTER */}
            <Card className="relative overflow-hidden border-primary/20">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  After
                </Badge>
              </div>
              <CodeBlock code={afterCode} language="tsx" />
            </Card>
          </div>

          {/* BENEFITS LIST */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">What You Gain:</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">OKLCH Color Space</div>
                    <div className="text-sm text-muted-foreground">
                      Perceptually uniform colors for smooth gradients
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Built-in Dark Mode</div>
                    <div className="text-sm text-muted-foreground">
                      No custom CSS required—just works
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">More Features</div>
                    <div className="text-sm text-muted-foreground">
                      Eyedropper, recent colors, presets, and more
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Better TypeScript</div>
                    <div className="text-sm text-muted-foreground">
                      Full type safety with autocomplete everywhere
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" asChild className="text-base px-8">
              <a
                href="https://github.com/garrettsiegel/chromakit#migration"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Migration Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
