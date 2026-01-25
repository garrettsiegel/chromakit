import { useState, useCallback, useEffect, useMemo } from 'react';
import type { ColorPickerProps, ColorFormat, ColorValue } from '../types';
import { useColorState } from '../hooks';
import { ColorArea } from './ColorArea';
import { HueSlider } from './HueSlider';
import { AlphaSlider } from './AlphaSlider';
import { ColorInputs, RGBInputs, HSLInputs, HSVInputs, OKLCHInputs } from './ColorInputs';
import { ColorPreview, PresetColors } from './ColorPreview';

const DEFAULT_PRESETS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00',
  '#ADFF2F', '#32CD32', '#00FA9A', '#00CED1', '#1E90FF',
  '#4169E1', '#8A2BE2', '#FF00FF', '#FF1493', '#DC143C',
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
];

type InputMode = 'single' | 'rgb' | 'hsl' | 'hsv' | 'oklch';

// Map color formats to input modes
const FORMAT_TO_MODE: Record<ColorFormat, InputMode> = {
  hex: 'single',
  hex8: 'single',
  rgb: 'rgb',
  rgba: 'rgb',
  hsl: 'hsl',
  hsla: 'hsl',
  hsv: 'hsv',
  hsva: 'hsv',
  oklab: 'single',
  oklch: 'oklch',
  oklcha: 'oklch',
};

export function ColorPicker({
  value,
  defaultValue = '#6366F1',
  onChange,
  onChangeComplete,
  formats = ['hex', 'rgb', 'hsl', 'oklch'],
  showAlpha = true,
  showInputs = true,
  showPreview = true,
  presets = DEFAULT_PRESETS,
  className = '',
  width = 280,
}: ColorPickerProps) {
  const initialColor = value || defaultValue;
  
  const {
    hsva,
    colorValue,
    updateColor,
    setFromString,
    startDrag,
    endDrag,
  } = useColorState(initialColor, onChange, onChangeComplete);

  const [format, setFormat] = useState<ColorFormat>(() => {
    // Default to first available format
    return formats[0] || 'hex';
  });
  
  // Determine available input modes based on formats prop
  const availableModes = useMemo(() => {
    const modes = new Set<InputMode>();
    modes.add('single'); // Always include text input
    for (const f of formats) {
      modes.add(FORMAT_TO_MODE[f]);
    }
    return Array.from(modes);
  }, [formats]);
  
  const [inputMode, setInputMode] = useState<InputMode>('single');

  // Sync inputMode when availableModes changes
  useEffect(() => {
    if (!availableModes.includes(inputMode)) {
      setInputMode(availableModes[0] || 'single');
    }
  }, [availableModes, inputMode]);

  // Sync format when formats prop changes
  useEffect(() => {
    if (!formats.includes(format)) {
      setFormat(formats[0] || 'hex');
    }
  }, [formats, format]);

  useEffect(() => {
    if (value) {
      setFromString(value);
    }
  }, [value, setFromString]);

  const handlePresetSelect = useCallback((color: string) => {
    const newColorValue = setFromString(color);
    if (newColorValue) {
      onChangeComplete?.(newColorValue);
    }
  }, [setFromString, onChangeComplete]);

  return (
    <div
      className={`flex flex-col gap-4 p-4 bg-card border border-card-border rounded-lg shadow-lg ${className}`}
      style={{ width }}
      data-testid="color-picker"
    >
      <ColorArea
        hsva={hsva}
        onChange={updateColor}
        onStart={startDrag}
        onEnd={endDrag}
        width={width - 32}
        height={180}
      />

      <div className="flex gap-3 items-center">
        {showPreview && (
          <ColorPreview colorValue={colorValue} size="lg" />
        )}
        <div className="flex-1 flex flex-col gap-3">
          <HueSlider
            hsva={hsva}
            onChange={updateColor}
            onStart={startDrag}
            onEnd={endDrag}
          />
          {showAlpha && (
            <AlphaSlider
              hsva={hsva}
              onChange={updateColor}
              onStart={startDrag}
              onEnd={endDrag}
            />
          )}
        </div>
      </div>

      {showInputs && (
        <div className="flex flex-col gap-3">
          {availableModes.length > 1 && (
            <div className="flex gap-1 p-0.5 bg-secondary/50 rounded-md">
              {availableModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setInputMode(mode)}
                  className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                    inputMode === mode
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`input-mode-${mode}`}
                >
                  {mode === 'single' ? 'TEXT' : mode.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {inputMode === 'single' && (
            <ColorInputs
              colorValue={colorValue}
              onChange={setFromString}
              format={format}
              onFormatChange={setFormat}
              showAlpha={showAlpha}
              availableFormats={formats}
            />
          )}
          {inputMode === 'rgb' && (
            <RGBInputs
              colorValue={colorValue}
              onChange={setFromString}
              showAlpha={showAlpha}
            />
          )}
          {inputMode === 'hsl' && (
            <HSLInputs
              colorValue={colorValue}
              onChange={setFromString}
              showAlpha={showAlpha}
            />
          )}
          {inputMode === 'hsv' && (
            <HSVInputs
              colorValue={colorValue}
              onChange={setFromString}
              showAlpha={showAlpha}
            />
          )}
          {inputMode === 'oklch' && (
            <OKLCHInputs
              colorValue={colorValue}
              onChange={setFromString}
              showAlpha={showAlpha}
            />
          )}
        </div>
      )}

      {presets && presets.length > 0 && (
        <div className="border-t border-border pt-3">
          <PresetColors
            colors={presets}
            selectedColor={colorValue.hex}
            onSelect={handlePresetSelect}
          />
        </div>
      )}
    </div>
  );
}
