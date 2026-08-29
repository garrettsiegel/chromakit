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

  const presetState = usePresets(presets, presetGroups);

  const { history, remember } = useColorHistory(enableHistory, historySize);

  const color = useColorState(initialColor, onChange, onChangeComplete, value);

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

  const { setFromString } = color;

  const handleSelectColor = useCallback(
    (selected: string) => {
      const newColorValue = setFromString(selected);
      if (newColorValue) {
        onChangeComplete?.(newColorValue);
        remember(selected);
      }
    },
    [setFromString, onChangeComplete, remember]
  );

  const handleCopy = useCallback(
    (success: boolean) => {
      if (success) remember(color.colorValue.hex);
    },
    [color.colorValue.hex, remember]
  );

  return (
    <PickerLayout
      className={className}
      width={width}
      areaHeight={height}
      color={color}
      presets={presetState}
      formats={formats}
      format={validFormat}
      setFormat={setFormat}
      inputMode={validInputMode}
      availableModes={availableModes}
      setInputMode={setInputMode}
      history={history}
      onSelectColor={handleSelectColor}
      onCopy={handleCopy}
      showAlpha={showAlpha}
      showInputs={showInputs}
      showPreview={showPreview}
      showCopyButton={showCopyButton}
      showEyeDropper={showEyeDropper}
      showPresets={showPresets}
      enableHistory={enableHistory}
    />
  );
}
