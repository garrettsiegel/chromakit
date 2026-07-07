import { useState, useCallback, useMemo, useReducer } from 'react';
import type { ColorPickerProps, ColorFormat } from '../types';
import { useColorState } from '../hooks';
import { getColorHistory, addToColorHistory } from '../utils';
import { PickerLayout, type InputMode } from './PickerLayout';
import { DEFAULT_PRESETS, DEFAULT_PRESET_GROUPS } from './preset-data';

type PresetAction =
  | { type: 'reset'; presets: string[] }
  | { type: 'set'; presets: string[] }
  | { type: 'update'; index: number; color: string }
  | { type: 'delete'; index: number }
  | { type: 'add'; color: string; limit: number };

function presetsReducer(state: string[], action: PresetAction): string[] {
  switch (action.type) {
    case 'reset':
    case 'set':
      return [...action.presets];
    case 'update': {
      if (action.index < 0 || action.index >= state.length) return state;
      const next = [...state];
      next[action.index] = action.color;
      return next;
    }
    case 'delete':
      return state.filter((_, i) => i !== action.index);
    case 'add':
      return state.length < action.limit ? [...state, action.color] : state;
    default:
      return state;
  }
}

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
  height,
  showCopyButton = true,
  showPresets = true,
  enableHistory = true,
  historySize = 10,
}: ColorPickerProps) {
  const initialColor = value || defaultValue;

  const [customPresets, dispatchPresets] = useReducer(
    presetsReducer,
    presets,
    (initialPresets) => [...initialPresets]
  );

  const normalizedPresetGroups = useMemo(() => {
    if (!presetGroups) return [];
    if (Array.isArray(presetGroups)) return presetGroups;
    return Object.entries(presetGroups).map(([name, colors]) => ({
      name,
      colors,
    }));
  }, [presetGroups]);

  const [selectedPresetGroup, setSelectedPresetGroup] = useState<string | null>(
    null
  );

  const [history, setHistory] = useState<string[]>(() =>
    enableHistory ? getColorHistory().slice(0, historySize) : []
  );

  const dimensions = useMemo(
    () => ({
      areaWidth: 160,
      areaHeight: height,
    }),
    [height]
  );

  const { hsva, colorValue, updateColor, setFromString, startDrag, endDrag } =
    useColorState(initialColor, onChange, onChangeComplete, value);

  const [format, setFormat] = useState<ColorFormat>(() => formats[0] || 'hex');

  const availableModes = useMemo(() => {
    const modes = new Set<InputMode>();
    modes.add('single'); // ALWAYS INCLUDE TEXT INPUT
    for (const f of formats) {
      modes.add(FORMAT_TO_MODE[f]);
    }
    return Array.from(modes);
  }, [formats]);

  const [inputMode, setInputMode] = useState<InputMode>('single');

  const validInputMode = useMemo(() => {
    return availableModes.includes(inputMode)
      ? inputMode
      : availableModes[0] || 'single';
  }, [availableModes, inputMode]);

  const validFormat = useMemo(() => {
    return formats.includes(format) ? format : formats[0] || 'hex';
  }, [formats, format]);

  const handlePresetSelect = useCallback(
    (color: string) => {
      const newColorValue = setFromString(color);
      if (newColorValue) {
        onChangeComplete?.(newColorValue);
        if (enableHistory) {
          const updated = addToColorHistory(color, historySize);
          setHistory(updated);
        }
      }
    },
    [setFromString, onChangeComplete, enableHistory, historySize]
  );

  const handleCopy = useCallback(
    (success: boolean) => {
      if (success && enableHistory) {
        const currentColor = colorValue.hex;
        const updated = addToColorHistory(currentColor, historySize);
        setHistory(updated);
      }
    },
    [colorValue, enableHistory, historySize]
  );

  const handleUpdatePreset = useCallback((index: number, color: string) => {
    dispatchPresets({ type: 'update', index, color });
  }, []);

  const handleDeletePreset = useCallback((index: number) => {
    dispatchPresets({ type: 'delete', index });
  }, []);

  const handleAddPreset = useCallback(() => {
    dispatchPresets({ type: 'add', color: colorValue.hex, limit: 24 });
  }, [colorValue.hex]);

  const handleLoadPresetGroup = useCallback(
    (groupName: string) => {
      const group = normalizedPresetGroups.find((g) => g.name === groupName);
      if (group) {
        dispatchPresets({ type: 'set', presets: group.colors });
        setSelectedPresetGroup(groupName);
      }
    },
    [normalizedPresetGroups]
  );

  return (
    <PickerLayout
      className={className}
      width={width}
      hsva={hsva}
      updateColor={updateColor}
      startDrag={startDrag}
      endDrag={endDrag}
      dimensions={dimensions}
      showAlpha={showAlpha}
      showInputs={showInputs}
      showPreview={showPreview}
      showCopyButton={showCopyButton}
      formats={formats}
      validInputMode={validInputMode}
      availableModes={availableModes}
      setInputMode={setInputMode}
      validFormat={validFormat}
      setFormat={setFormat}
      colorValue={colorValue}
      setFromString={setFromString}
      handleCopy={handleCopy}
      enableHistory={enableHistory}
      history={history}
      handlePresetSelect={handlePresetSelect}
      showPresets={showPresets}
      customPresets={customPresets}
      handleUpdatePreset={handleUpdatePreset}
      handleDeletePreset={handleDeletePreset}
      handleAddPreset={handleAddPreset}
      normalizedPresetGroups={normalizedPresetGroups}
      selectedPresetGroup={selectedPresetGroup}
      handleLoadPresetGroup={handleLoadPresetGroup}
    />
  );
}
