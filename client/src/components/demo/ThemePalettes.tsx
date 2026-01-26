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
  tailwind: ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9', '#f8fafc'],
  dracula: ['#282a36', '#44475a', '#6272a4', '#bd93f9', '#ff79c6', '#ffb86c', '#f8f8f2'],
  nord: ['#2e3440', '#3b4252', '#434c5e', '#4c566a', '#88c0d0', '#8fbcbb', '#eceff4'],
  github: ['#0d1117', '#161b22', '#21262d', '#30363d', '#1f6feb', '#58a6ff', '#c8e1ff'],
  vercel: ['#000000', '#111111', '#333333', '#666666', '#888888', '#eaeaea', '#fafafa'],
  radix: ['#11181c', '#1e2a3a', '#3254a1', '#3e63dd', '#5373e7', '#849dff', '#d4f1f4'],
} as const;

export function ThemePalettes() {
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEME_PRESETS>('tailwind');
  const [selectedColor, setSelectedColor] = useState<string>(THEME_PRESETS.tailwind[0]);
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
