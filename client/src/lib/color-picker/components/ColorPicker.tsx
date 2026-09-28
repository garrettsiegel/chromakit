import { useState, useCallback, useMemo } from 'react';
import type { ColorPickerProps, ColorFormat } from '../types';
import { useColorState } from '../hooks';
import { PickerLayout } from './PickerLayout';
import type { InputMode } from './InputValuePanel';
import { DEFAULT_PRESETS, DEFAULT_PRESET_GROUPS } from './preset-data';
import { usePresets, useColorHistory } from './picker-state';
import { COLOR_FORMATS } from './formats';
import { MAX_HISTORY_SIZE } from '../constants';

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
  layout = 'compact',
  defaultValue = '#6366F1',
  onChange,
  onChangeComplete,
  formats = COLOR_FORMATS,
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
  historySize = MAX_HISTORY_SIZE,
}: ColorPickerProps) {
  const initialColor = value || defaultValue;

  const presetState = usePresets(presets, presetGroups);

  const { history, remember } = useColorHistory(enableHistory, historySize);

  const color = useColorState(initialColor, {
    value,
    onChange,
    onChangeComplete,
  });

  const availableModes = useMemo(() => {
    const modes = new Set<InputMode>();
    modes.add('single');
    for (const f of formats) {
      modes.add(FORMAT_TO_MODE[f]);
    }
    return Array.from(modes);
  }, [formats]);

  const [inputMode, setInputMode] = useState<InputMode>('single');

  const validInputMode = useMemo(() => {
    return availableModes.includes(inputMode) ? inputMode : 'single';
  }, [availableModes, inputMode]);

  const validFormat: ColorFormat = formats[0] || 'hex';

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
      layout={layout}
      className={className}
      width={width}
      areaHeight={height}
      color={color}
      presets={presetState}
      format={validFormat}
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
