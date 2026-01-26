import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker, type ColorValue } from '@/lib/color-picker';
import { CustomPickerDemo } from '@/components/demo/CustomPickerDemo';
import { ColorFormatsDisplay } from '@/components/demo/ColorFormatsDisplay';
import { ThemePalettes } from '@/components/demo/ThemePalettes';
import { Badge } from '@/components/ui/badge';

// ============================================================
// MAIN DEMO PLAYGROUND COMPONENT
// ============================================================

export function DemoPlayground() {
  const [color, setColor] = useState('#ff6b35');
  const [colorValue, setColorValue] = useState<ColorValue | null>(null);

  const handleColorChange = (newColor: ColorValue) => {
    setColor(newColor.hex);
    setColorValue(newColor);
  };

  return (
    <section id="demo" className="relative py-20 md:py-32 overflow-hidden">
      {/* GLASSMORPHIC BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
        <div
          className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-30 blur-3xl animate-float"
          style={{
            background: 'radial-gradient(circle, hsl(18, 98%, 60%) 0%, transparent 60%)',
            animationDuration: '20s',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, hsl(270, 85%, 65%) 0%, transparent 60%)',
            animationDuration: '25s',
            animationDelay: '3s',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* HEADING */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mb-4">
              Try It Live
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Interactive Playground
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience OKLCH color picking in action with our pre-built and composable components
            </p>
          </div>

          {/* TABS */}
          <Tabs defaultValue="preset" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
              <TabsTrigger value="preset">Full Picker</TabsTrigger>
              <TabsTrigger value="custom">Composable</TabsTrigger>
              <TabsTrigger value="themes">Themes</TabsTrigger>
            </TabsList>

            {/* FULL PRESET PICKER */}
            <TabsContent value="preset" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* PICKER */}
                <Card className="p-8 flex items-center justify-center bg-gradient-to-br from-background to-muted/30 noise-texture">
                  <ColorPicker
                    value={color}
                    onChange={handleColorChange}
                  />
                </Card>

                {/* OUTPUT */}
                <Card className="p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Color Formats</h3>
                    {colorValue && <ColorFormatsDisplay colorValue={colorValue} />}
                  </div>
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/20"
                        style={{ backgroundColor: color }}
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Current Color</div>
                        <div className="font-mono text-xs text-muted-foreground">{color}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Fully featured color picker with OKLCH, eyedropper, recent colors, and presets
              </p>
            </TabsContent>

            {/* CUSTOM COMPOSABLE PICKER */}
            <TabsContent value="custom" className="mt-8">
              <Card className="p-8 bg-gradient-to-br from-background to-muted/30">
                <CustomPickerDemo />
              </Card>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Build your own picker with composable primitives—full control over layout and
                styling
              </p>
            </TabsContent>

            {/* THEME PALETTES */}
            <TabsContent value="themes" className="mt-8">
              <ThemePalettes />
              <p className="text-center text-sm text-muted-foreground mt-6">
                Pre-built color themes from popular design systems—ready to use
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
