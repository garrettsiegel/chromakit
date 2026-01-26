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
  '#6366F1',
  '#EC4899',
  '#F97316',
  '#22C55E',
  '#06B6D4',
  '#8B5CF6',
];

const DEFAULT_PRESET_GROUPS = [
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
  formats = [
    'hex',
    'hex8',
    'rgb',
    'rgba',
    'hsl',
    'hsla',
    'hsv',
    'hsva',
    'oklab',
    'oklch',
    'oklcha',
  ],
  showAlpha = true,
  showInputs = true,
  showPreview = true,
  presets = DEFAULT_PRESETS,
  presetGroups = DEFAULT_PRESET_GROUPS,
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

  const normalizedPresetGroups = useMemo(() => {
    if (!presetGroups) return [];
    if (Array.isArray(presetGroups)) return presetGroups;
    return Object.entries(presetGroups).map(([name, colors]) => ({
      name,
      colors,
    }));
  }, [presetGroups]);

  // Track selected preset group
  const [selectedPresetGroup, setSelectedPresetGroup] = useState<string | null>(
    null
  );

  // Load color history
  const [history, setHistory] = useState<string[]>(() =>
    enableHistory ? getColorHistory() : []
  );

  // Fixed compact dimensions - horizontal compact layout
  const dimensions = useMemo(
    () => ({
      areaWidth: 160,
      areaHeight: 100,
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

  // Handler to load a preset group
  const handleLoadPresetGroup = useCallback(
    (groupName: string) => {
      const group = normalizedPresetGroups.find((g) => g.name === groupName);
      if (group) {
        setCustomPresets(group.colors);
        setSelectedPresetGroup(groupName);
      }
    },
    [normalizedPresetGroups]
  );

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
            </div>
          )}

          {/* Preview + Format Selector */}
          {showPreview && (
            <div className="ck-action-buttons-row">
              <ColorPreview
                colorValue={colorValue}
                size="lg"
                className="ck-preview-wide"
              />
              <div className="ck-action-buttons">
                {inputMode === 'single' && (
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ColorFormat)}
                    className="ck-select"
                    data-testid="color-format-select"
                  >
                    {formats.map((f) => (
                      <option key={f} value={f}>
                        {f.toUpperCase()}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Color Value Inputs */}
          {showInputs && (
            <div className="ck-inputs-values">
              {inputMode === 'single' && (
                <div className="ck-input-row">
                  <input
                    type="text"
                    value={formatColor(colorValue, format)}
                    onChange={(e) => setFromString(e.target.value)}
                    className="ck-input"
                    data-testid="color-input-text"
                  />
                  {showCopyButton && (
                    <CopyButton
                      text={formatColor(colorValue, format)}
                      onCopy={handleCopy}
                    />
                  )}
                </div>
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
                presetGroups={normalizedPresetGroups}
                selectedPresetGroup={selectedPresetGroup}
                onLoadPresetGroup={handleLoadPresetGroup}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
