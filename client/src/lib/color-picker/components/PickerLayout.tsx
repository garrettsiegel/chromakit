import type { ColorFormat } from '../types';
import type { useColorState } from '../hooks';
import type { usePresets } from './picker-state';
import { ColorArea } from './ColorArea';
import { HueSlider } from './HueSlider';
import { AlphaSlider } from './AlphaSlider';
import { ColorPreview } from './ColorPreview';
import { PresetColors } from './PresetColors';
import { RecentColors } from './RecentColors';
import { EyeDropperButton } from './EyeDropperButton';
import { InputValuePanel, type InputMode } from './InputValuePanel';

export type { InputMode };

/** Width of the saturation/value area, in pixels. */
const AREA_WIDTH = 160;

interface PickerLayoutProps {
  className: string;
  width?: number | string;
  areaHeight?: number;
  /** The live color state, straight from `useColorState`. */
  color: ReturnType<typeof useColorState>;
  /** The editable swatch state, straight from `usePresets`. */
  presets: ReturnType<typeof usePresets>;
  formats: ColorFormat[];
  format: ColorFormat;
  setFormat: (format: ColorFormat) => void;
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

export function PickerLayout({
  className,
  width,
  areaHeight,
  color,
  presets,
  formats,
  format,
  setFormat,
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
}: PickerLayoutProps) {
  return (
    <div
      className={`ck-color-picker ${className}`.trim()}
      style={
        width
          ? ({
              width,
              '--ck-width': typeof width === 'number' ? `${width}px` : width,
            } as React.CSSProperties)
          : undefined
      }
      data-testid="color-picker"
    >
      <div className="ck-picker-main">
        <ColorArea
          hsva={color.hsva}
          onChange={color.updateColor}
          onStart={color.startDrag}
          onEnd={color.endDrag}
          width={AREA_WIDTH}
          height={areaHeight}
        />

        <div className="ck-picker-controls">
          <div className="ck-controls-row">
            <div className="ck-sliders-group">
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
            <div className="ck-inputs">
              {availableModes.length > 1 && (
                <div className="ck-input-modes">
                  {availableModes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={inputMode === mode}
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

          {showPreview && (
            <div className="ck-action-buttons-row">
              <ColorPreview
                colorValue={color.colorValue}
                size="lg"
                className="ck-preview-wide"
              />
              <div className="ck-action-buttons">
                {showEyeDropper && (
                  <EyeDropperButton onPick={color.setFromString} />
                )}
                {inputMode === 'single' && (
                  <select
                    aria-label="Color format"
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

          {showInputs && (
            <div className="ck-inputs-values">
              <InputValuePanel
                inputMode={inputMode}
                colorValue={color.colorValue}
                format={format}
                setFromString={color.setFromString}
                showAlpha={showAlpha}
                showCopyButton={showCopyButton}
                onCopy={onCopy}
              />
            </div>
          )}

          {enableHistory && history.length > 0 && (
            <RecentColors colors={history} onColorSelect={onSelectColor} />
          )}

          {showPresets && presets.customPresets.length > 0 && (
            <div className="ck-presets">
              <PresetColors
                colors={presets.customPresets}
                selectedColor={color.colorValue.hex}
                onSelect={onSelectColor}
                onUpdatePreset={(index) =>
                  presets.updatePreset(index, color.colorValue.hex)
                }
                onDeletePreset={presets.deletePreset}
                onAddPreset={() => presets.addPreset(color.colorValue.hex)}
                presetGroups={presets.normalizedPresetGroups}
                selectedPresetGroup={presets.selectedPresetGroup}
                onLoadPresetGroup={presets.loadPresetGroup}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
