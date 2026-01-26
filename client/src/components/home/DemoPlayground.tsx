import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ColorPicker,
  type ColorValue,
  type PresetGroup,
} from '@/lib/color-picker';
import { CustomPickerDemo } from '@/components/demo/CustomPickerDemo';
import { ColorFormatsDisplay } from '@/components/demo/ColorFormatsDisplay';
import { ThemePalettes } from '@/components/demo/ThemePalettes';
import { Badge } from '@/components/ui/badge';

// ============================================================
// PRESET GROUPS
// ============================================================

const DEMO_PRESET_GROUPS: PresetGroup[] = [
  {
    name: 'Material',
    colors: [
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107',
      '#FF9800',
      '#FF5722',
      '#795548',
      '#9E9E9E',
      '#607D8B',
    ],
  },
  {
    name: 'Tailwind',
    colors: [
      '#EF4444',
      '#F97316',
      '#EAB308',
      '#22C55E',
      '#10B981',
      '#14B8A6',
      '#06B6D4',
      '#0EA5E9',
      '#3B82F6',
      '#6366F1',
      '#8B5CF6',
      '#D946EF',
      '#EC4899',
      '#F43F5E',
    ],
  },
  {
    name: 'shadcn/ui',
    colors: [
      '#0F172A',
      '#1E293B',
      '#334155',
      '#475569',
      '#64748B',
      '#3B82F6',
      '#6366F1',
      '#10B981',
      '#F59E0B',
      '#F43F5E',
    ],
  },
  {
    name: 'Bootstrap',
    colors: [
      '#0D6EFD',
      '#6610F2',
      '#6F42C1',
      '#D63384',
      '#DC3545',
      '#FD7E14',
      '#FFC107',
      '#198754',
      '#20C997',
      '#0DCAF0',
    ],
  },
  {
    name: 'Chakra UI',
    colors: [
      '#3182CE',
      '#2B6CB0',
      '#2C5282',
      '#63B3ED',
      '#90CDF4',
      '#38A169',
      '#48BB78',
      '#68D391',
      '#D69E2E',
      '#ED8936',
    ],
  },
  {
    name: 'Grayscale',
    colors: [
      '#000000',
      '#1F1F1F',
      '#3F3F3F',
      '#5F5F5F',
      '#7F7F7F',
      '#9F9F9F',
      '#BFBFBF',
      '#DFDFDF',
      '#FFFFFF',
    ],
  },
];

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
            background:
              'radial-gradient(circle, hsl(18, 98%, 60%) 0%, transparent 60%)',
            animationDuration: '20s',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl animate-float-delayed"
          style={{
            background:
              'radial-gradient(circle, hsl(270, 85%, 65%) 0%, transparent 60%)',
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
              Experience OKLCH color picking in action with our pre-built and
              composable components
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
                    presetGroups={DEMO_PRESET_GROUPS}
                  />
                </Card>

                {/* OUTPUT */}
                <Card className="p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Color Formats
                    </h3>
                    {colorValue && (
                      <ColorFormatsDisplay colorValue={colorValue} />
                    )}
                  </div>
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/20"
                        style={{ backgroundColor: color }}
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Current Color</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {color}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Fully featured color picker with OKLCH, eyedropper, recent
                colors, and presets
              </p>
            </TabsContent>

            {/* CUSTOM COMPOSABLE PICKER */}
            <TabsContent value="custom" className="mt-8">
              <Card className="p-8 bg-gradient-to-br from-background to-muted/30">
                <CustomPickerDemo />
              </Card>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Build your own picker with composable primitives—full control
                over layout and styling
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
