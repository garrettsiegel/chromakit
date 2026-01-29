import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ColorPicker,
  type ColorValue,
  type PresetGroup,
} from '@/lib/color-picker';
import { CustomPickerDemo } from '@/components/demo/CustomPickerDemo';
import { ColorFormatsDisplay } from '@/components/demo/ColorFormatsDisplay';

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
      '#EC4899',
    ],
  },
];

// ============================================================
// MAIN DEMO PLAYGROUND COMPONENT
// ============================================================

export function DemoPlayground() {
  const [color, setColor] = useState('#7c3aed');
  const [colorValue, setColorValue] = useState<ColorValue | null>(null);

  const handleColorChange = useCallback((newColor: ColorValue) => {
    setColor(newColor.hex);
    setColorValue(newColor);
  }, []);

  return (
    <section id="demo" className="relative py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Try It Live
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the smoothest color picker for React
            </p>
          </div>

          {/* Demo Tabs */}
          <Tabs defaultValue="full" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="full">Complete</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="formats">Formats</TabsTrigger>
            </TabsList>

            <TabsContent value="full" className="space-y-8">
              <div className="flex flex-col lg:flex-row items-start gap-8 justify-center">
                <div className="flex-shrink-0">
                  <ColorPicker
                    value={color}
                    onChange={handleColorChange}
                    presetGroups={DEMO_PRESET_GROUPS}
                  />
                </div>
                {colorValue && (
                  <div className="flex-1 min-w-0 w-full lg:max-w-md">
                    <ColorFormatsDisplay colorValue={colorValue} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <div className="flex justify-center">
                <CustomPickerDemo />
              </div>
            </TabsContent>

            <TabsContent value="formats">
              <div className="flex flex-col items-center gap-8">
                <div className="flex-shrink-0">
                  <ColorPicker
                    value={color}
                    onChange={handleColorChange}
                    showPresets={false}
                    width={280}
                  />
                </div>
                {colorValue && (
                  <div className="w-full max-w-2xl">
                    <ColorFormatsDisplay colorValue={colorValue} />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
