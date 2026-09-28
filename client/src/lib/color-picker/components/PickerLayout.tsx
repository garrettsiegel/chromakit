import type { CSSProperties } from 'react';
import type { ColorFormat } from '../types';
import type { useColorState } from '../hooks';
import type { usePresets } from './picker-state';
import { formatColor } from '../conversions';
import { ColorArea } from './ColorArea';
import { HueSlider } from './HueSlider';
import { AlphaSlider } from './AlphaSlider';
import { ColorPreview } from './ColorPreview';
import { CopyButton } from './CopyButton';
import { EyeDropperButton } from './EyeDropperButton';
import { InputValuePanel, type InputMode } from './InputValuePanel';

const RECENT_LIMIT = 4;

export type PickerLayoutMode = 'compact' | 'wide';

const CHANNEL_FORMATS: Record<
  Exclude<InputMode, 'single'>,
  [ColorFormat, ColorFormat]
> = {
  rgb: ['rgb', 'rgba'],
  hsl: ['hsl', 'hsla'],
  hsv: ['hsv', 'hsva'],
  oklab: ['oklab', 'oklaba'],
  oklch: ['oklch', 'oklcha'],
};

interface PickerLayoutProps {
  layout: PickerLayoutMode;
  className: string;
  width?: number | string;
  areaHeight?: number;
  color: ReturnType<typeof useColorState>;
  presets: ReturnType<typeof usePresets>;
  format: ColorFormat;
  inputMode: InputMode;
  availableModes: InputMode[];
  setInputMode: (mode: InputMode) => void;
  history: string[];
  onSelectColor: (color: string) => void;
  onCopy: (success: boolean) => void;
  showAlpha: boolean;
  showInputs: boolean;
  showPreview: boolean;
  showCopyButton: boolean;
  showEyeDropper: boolean;
  showPresets: boolean;
  enableHistory: boolean;
}

export const PickerLayout = ({
  layout,
  className,
  width,
  areaHeight,
  color,
  presets,
  format,
  inputMode,
  availableModes,
  setInputMode,
  history,
  onSelectColor,
  onCopy,
  showAlpha,
  showInputs,
  showPreview,
  showCopyButton,
  showEyeDropper,
  showPresets,
  enableHistory,
}: PickerLayoutProps) => {
  const { colorValue } = color;
  const withAlpha = showAlpha && colorValue.rgba.a < 1;
  const copyFormat =
    inputMode === 'single'
      ? format
      : CHANNEL_FORMATS[inputMode][withAlpha ? 1 : 0];
  const current = colorValue.hex.toLowerCase();
  const presetColors = showPresets ? presets.customPresets : [];
  const showGroups =
    layout === 'wide' &&
    showPresets &&
    presets.normalizedPresetGroups.length > 0;
  const recentColors = enableHistory
    ? history
        .filter(
          (c) => !presetColors.some((p) => p.toLowerCase() === c.toLowerCase())
        )
        .slice(0, RECENT_LIMIT)
    : [];

  const chip = (swatch: string) => (
    <button
      key={swatch}
      type="button"
      className="ck-picker-chip"
      style={{ backgroundColor: swatch }}
      title={swatch}
      aria-label={`Select ${swatch}`}
      aria-pressed={swatch.toLowerCase() === current}
      onClick={() => onSelectColor(swatch)}
    />
  );

  return (
    <div
      className={`ck-color-picker${layout === 'wide' ? ' ck-color-picker--wide' : ''} ${className}`.trim()}
      style={
        width
          ? ({
              '--ck-width': typeof width === 'number' ? `${width}px` : width,
            } as CSSProperties)
          : undefined
      }
      data-testid="color-picker"
    >
      <ColorArea
        hsva={color.hsva}
        onChange={color.updateColor}
        onStart={color.startDrag}
        onEnd={color.endDrag}
        height={areaHeight}
      />

      <div
        className={`ck-picker-sliders${showAlpha ? '' : ' ck-picker-sliders--hue-only'}${showPreview ? '' : ' ck-picker-sliders--no-preview'}`}
      >
        {showPreview && (
          <ColorPreview
            colorValue={colorValue}
            className="ck-checkerboard ck-picker-preview"
          />
        )}
        <div className="ck-picker-tracks">
          <HueSlider
            hsva={color.hsva}
            onChange={color.updateColor}
            onStart={color.startDrag}
            onEnd={color.endDrag}
          />
          {showAlpha && (
            <AlphaSlider
              hsva={color.hsva}
              onChange={color.updateColor}
              onStart={color.startDrag}
              onEnd={color.endDrag}
            />
          )}
        </div>
      </div>

      {showInputs && (
        <div
          className={`ck-picker-value${inputMode === 'single' ? '' : ' ck-picker-value--channels'}`}
        >
          {availableModes.length > 1 && (
            <select
              aria-label="Color format"
              value={inputMode}
              onChange={(e) => setInputMode(e.target.value as InputMode)}
              className="ck-select"
              data-testid="color-format-select"
            >
              {availableModes.map((mode) => (
                <option key={mode} value={mode}>
                  {(mode === 'single' ? format : mode).toUpperCase()}
                </option>
              ))}
            </select>
          )}
          <InputValuePanel
            inputMode={inputMode}
            colorValue={colorValue}
            format={format}
            setFromString={color.setFromString}
            showAlpha={showAlpha}
            showCopyButton={false}
            onCopy={onCopy}
          />
          {showCopyButton && (
            <CopyButton
              text={formatColor(colorValue, copyFormat)}
              onCopy={onCopy}
            />
          )}
          {showEyeDropper && <EyeDropperButton onPick={color.setFromString} />}
        </div>
      )}

      {(presetColors.length > 0 || recentColors.length > 0 || showPresets) && (
        <div className="ck-picker-swatches">
          <div className="ck-picker-chips">
            {presetColors.map(chip)}
            {recentColors.length > 0 && presetColors.length > 0 && (
              <span className="ck-picker-divider" aria-hidden="true" />
            )}
            {recentColors.map(chip)}
          </div>
          <div className="ck-picker-actions">
            {showGroups && (
              <select
                aria-label="Preset group"
                className="ck-picker-groups"
                value={presets.selectedPresetGroup ?? ''}
                onChange={(e) => presets.loadPresetGroup(e.target.value)}
              >
                <option value="" disabled>
                  Presets
                </option>
                {presets.normalizedPresetGroups.map((group) => (
                  <option key={group.name} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
            )}
            {showPresets && (
              <button
                type="button"
                className="ck-picker-add"
                title="Save as preset"
                aria-label="Save the current color as a preset"
                onClick={() => presets.addPreset(colorValue.hex)}
              >
                +
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
