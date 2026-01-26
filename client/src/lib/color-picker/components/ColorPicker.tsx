import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  ColorPickerProps,
  ColorFormat,
  ColorValue as _ColorValue,
} from '../types';
import { useColorState } from '../hooks';
import { ColorArea } from './ColorArea';
import { HueSlider } from './HueSlider';
import { AlphaSlider } from './AlphaSlider';
import {
  ColorInputs,
  RGBInputs,
  HSLInputs,
  HSVInputs,
  OKLCHInputs,
} from './ColorInputs';
import { ColorPreview, PresetColors } from './ColorPreview';
import { CopyButton } from './CopyButton';
import { RecentColors } from './RecentColors';
import { getColorHistory, addToColorHistory, copyToClipboard } from '../utils';
import { formatColor } from '../conversions';

const DEFAULT_PRESETS = [
  '#FF0000',
  '#FF4500',
  '#FF8C00',
  '#FFD700',
  '#FFFF00',
  '#ADFF2F',
  '#32CD32',
  '#00FA9A',
  '#00CED1',
  '#1E90FF',
  '#4169E1',
  '#8A2BE2',
  '#FF00FF',
  '#FF1493',
  '#DC143C',
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#CCCCCC',
  '#FFFFFF',
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
  width,
  showCopyButton = true,
  showPresets = true,
  enableHistory = true,
  _historySize = 10,
}: ColorPickerProps) {
  const initialColor = value || defaultValue;

  // Track customizable presets
  const [customPresets, setCustomPresets] = useState<string[]>(presets);

  // Load color history
  const [history, setHistory] = useState<string[]>(() =>
    enableHistory ? getColorHistory() : []
  );

  // Fixed compact dimensions - horizontal compact layout
  const dimensions = useMemo(
    () => ({
      areaWidth: 80,
      areaHeight: 70,
    }),
    []
  );

  const { hsva, colorValue, updateColor, setFromString, startDrag, endDrag } =
    useColorState(initialColor, onChange, onChangeComplete);

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

  const handlePresetSelect = useCallback(
    (color: string) => {
      const newColorValue = setFromString(color);
      if (newColorValue) {
        onChangeComplete?.(newColorValue);
        if (enableHistory) {
          const updated = addToColorHistory(color);
          setHistory(updated);
        }
      }
    },
    [setFromString, onChangeComplete, enableHistory]
  );

  const handleCopy = useCallback(
    (success: boolean) => {
      if (success && enableHistory) {
        const currentColor = colorValue.hex;
        const updated = addToColorHistory(currentColor);
        setHistory(updated);
      }
    },
    [colorValue, enableHistory]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Cmd/Ctrl + C to copy color
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === 'c' &&
        !isInInput &&
        showCopyButton
      ) {
        e.preventDefault();
        const colorText = formatColor(colorValue, format);
        copyToClipboard(colorText).then((success) => {
          if (success && enableHistory) {
            const updated = addToColorHistory(colorValue.hex);
            setHistory(updated);
          }
        });
      }

      // Cmd/Ctrl + C to copy color
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && showCopyButton) {
        e.preventDefault();
        copyToClipboard(formatColor(colorValue, format));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colorValue, format, showCopyButton, enableHistory]);

  // Use custom presets (allows user modification)
  const allPresets = customPresets;

  // Handler to update a preset color (e.g., on long-press or right-click)
  const handleUpdatePreset = useCallback(
    (index: number, color: string) => {
      const newPresets = [...customPresets];
      newPresets[index] = color;
      setCustomPresets(newPresets);
    },
    [customPresets]
  );

  // Handler to delete a preset
  const handleDeletePreset = useCallback(
    (index: number) => {
      const newPresets = customPresets.filter((_, i) => i !== index);
      setCustomPresets(newPresets);
    },
    [customPresets]
  );

  // Handler to add current color as a new preset
  const handleAddPreset = useCallback(() => {
    if (customPresets.length < 24) {
      setCustomPresets([...customPresets, colorValue.hex]);
    }
  }, [customPresets, colorValue.hex]);

  return (
    <div
      className={`ck-color-picker ${className}`.trim()}
      style={width ? { width } : undefined}
      data-testid="color-picker"
    >
      <div className="ck-picker-main">
        {/* Color Area on the left */}
        <ColorArea
          hsva={hsva}
          onChange={updateColor}
          onStart={startDrag}
          onEnd={endDrag}
          width={dimensions.areaWidth}
          height={dimensions.areaHeight}
        />

        {/* Controls on the right */}
        <div className="ck-picker-controls">
          {/* Sliders */}
          <div className="ck-controls-row">
            <div className="ck-sliders-group">
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

          {/* Preview + Action Buttons */}
          {(showPreview || showCopyButton) && (
            <div className="ck-action-buttons-row">
              {showPreview && (
                <ColorPreview
                  colorValue={colorValue}
                  size="lg"
                  className="ck-preview-wide"
                />
              )}
              <div className="ck-action-buttons">
                {showCopyButton && (
                  <CopyButton
                    text={formatColor(colorValue, format)}
                    onCopy={handleCopy}
                  />
                )}
              </div>
            </div>
          )}

          {/* Inputs */}
          {showInputs && (
            <div className="ck-inputs">
              {availableModes.length > 1 && (
                <div className="ck-input-modes">
                  {availableModes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setInputMode(mode)}
                      className={`ck-input-mode-btn ${inputMode === mode ? 'active' : ''}`}
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

          {/* Recent Colors */}
          {enableHistory && history.length > 0 && (
            <RecentColors onColorSelect={handlePresetSelect} />
          )}

          {/* Presets */}
          {showPresets && allPresets && allPresets.length > 0 && (
            <div className="ck-presets">
              <PresetColors
                colors={allPresets}
                selectedColor={colorValue.hex}
                onSelect={handlePresetSelect}
                onUpdatePreset={(index) =>
                  handleUpdatePreset(index, colorValue.hex)
                }
                onDeletePreset={handleDeletePreset}
                onAddPreset={handleAddPreset}
                currentColor={colorValue.hex}
                editable={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
