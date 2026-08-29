import { useState, useCallback, useMemo } from 'react';
import type { ColorPickerProps, ColorFormat } from '../types';
import { useColorState } from '../hooks';
import { PickerLayout, type InputMode } from './PickerLayout';
import { DEFAULT_PRESETS, DEFAULT_PRESET_GROUPS } from './preset-data';
import { usePresets, useColorHistory } from './picker-state';

const FORMAT_TO_MODE: Record<ColorFormat, InputMode> = {
  hex: 'single',
  hex8: 'single',
  rgb: 'rgb',
  rgba: 'rgb',
  hsl: 'hsl',
  hsla: 'hsl',
  hsv: 'hsv',
  hsva: 'hsv',
  oklab: 'oklab',
  oklaba: 'oklab',
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
    'oklaba',
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
  showEyeDropper = true,
  showPresets = true,
  enableHistory = true,
  historySize = 10,
}: ColorPickerProps) {
  const initialColor = value || defaultValue;

  const {
    customPresets,
    normalizedPresetGroups,
    selectedPresetGroup,
    updatePreset,
    deletePreset,
    addPreset,
    loadPresetGroup,
  } = usePresets(presets, presetGroups);

  const { history, remember } = useColorHistory(enableHistory, historySize);

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
        remember(color);
      }
    },
    [setFromString, onChangeComplete, remember]
  );

  const handleCopy = useCallback(
    (success: boolean) => {
      if (success) remember(colorValue.hex);
    },
    [colorValue.hex, remember]
  );

  const handleUpdatePreset = useCallback(
    (index: number, color: string) => updatePreset(index, color),
    [updatePreset]
  );

  const handleAddPreset = useCallback(
    () => addPreset(colorValue.hex),
    [addPreset, colorValue.hex]
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
      showEyeDropper={showEyeDropper}
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
      handleDeletePreset={deletePreset}
      handleAddPreset={handleAddPreset}
      normalizedPresetGroups={normalizedPresetGroups}
      selectedPresetGroup={selectedPresetGroup}
      handleLoadPresetGroup={loadPresetGroup}
    />
  );
}
