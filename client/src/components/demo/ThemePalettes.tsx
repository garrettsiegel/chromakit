import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ColorPreview,
  PresetColors,
  useColorState,
} from '@/lib/color-picker';
import { ColorFormatsDisplay } from './ColorFormatsDisplay';

const THEME_PRESETS = {
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#957DAD', '#D4A5A5'],
  dark: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483', '#2C3E50', '#34495E', '#5D6D7E'],
  nature: ['#2D5A27', '#4A7C59', '#6B8E23', '#9ACD32', '#556B2F', '#8B4513', '#D2691E', '#CD853F'],
  ocean: ['#006994', '#0077B6', '#00B4D8', '#48CAE4', '#90E0EF', '#023E8A', '#03045E', '#ADE8F4'],
} as const;

export function ThemePalettes() {
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEME_PRESETS>('vibrant');
  const [selectedColor, setSelectedColor] = useState<string>(THEME_PRESETS.vibrant[0]);
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
          colors={[...THEME_PRESETS[selectedTheme]]}
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
