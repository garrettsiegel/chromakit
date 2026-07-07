import type { ColorFormat } from '../types';
import type { useColorState } from '../hooks';
import { formatColor } from '../conversions';
import { ColorArea } from './ColorArea';
import { HueSlider } from './HueSlider';
import { AlphaSlider } from './AlphaSlider';
import { RGBInputs } from './RGBInputs';
import { HSLInputs } from './HSLInputs';
import { HSVInputs } from './HSVInputs';
import { OKLCHInputs } from './OKLCHInputs';
import { ColorPreview } from './ColorPreview';
import { PresetColors } from './PresetColors';
import { CopyButton } from './CopyButton';
import { RecentColors } from './RecentColors';

export type InputMode = 'single' | 'rgb' | 'hsl' | 'hsv' | 'oklch';

interface PickerLayoutProps {
  className: string;
  width?: number | string;
  hsva: ReturnType<typeof useColorState>['hsva'];
  updateColor: ReturnType<typeof useColorState>['updateColor'];
  startDrag: ReturnType<typeof useColorState>['startDrag'];
  endDrag: ReturnType<typeof useColorState>['endDrag'];
  dimensions: {
    areaWidth: number;
    areaHeight: number | undefined;
  };
  showAlpha: boolean;
  showInputs: boolean;
  showPreview: boolean;
  showCopyButton: boolean;
  formats: ColorFormat[];
  validInputMode: InputMode;
  availableModes: InputMode[];
  setInputMode: (mode: InputMode) => void;
  validFormat: ColorFormat;
  setFormat: (format: ColorFormat) => void;
  colorValue: ReturnType<typeof useColorState>['colorValue'];
  setFromString: ReturnType<typeof useColorState>['setFromString'];
  handleCopy: (success: boolean) => void;
  enableHistory: boolean;
  history: string[];
  handlePresetSelect: (color: string) => void;
  showPresets: boolean;
  customPresets: string[];
  handleUpdatePreset: (index: number, color: string) => void;
  handleDeletePreset: (index: number) => void;
  handleAddPreset: () => void;
  normalizedPresetGroups: {
    name: string;
    colors: string[];
  }[];
  selectedPresetGroup: string | null;
  handleLoadPresetGroup: (groupName: string) => void;
}

export function PickerLayout({
  className,
  width,
  hsva,
  updateColor,
  startDrag,
  endDrag,
  dimensions,
  showAlpha,
  showInputs,
  showPreview,
  showCopyButton,
  formats,
  validInputMode,
  availableModes,
  setInputMode,
  validFormat,
  setFormat,
  colorValue,
  setFromString,
  handleCopy,
  enableHistory,
  history,
  handlePresetSelect,
  showPresets,
  customPresets,
  handleUpdatePreset,
  handleDeletePreset,
  handleAddPreset,
  normalizedPresetGroups,
  selectedPresetGroup,
  handleLoadPresetGroup,
}: PickerLayoutProps) {
  return (
    <div
      className={`ck-color-picker ${className}`.trim()}
      style={width ? { width } : undefined}
      data-testid="color-picker"
    >
      <div className="ck-picker-main">
        <ColorArea
          hsva={hsva}
          onChange={updateColor}
          onStart={startDrag}
          onEnd={endDrag}
          width={dimensions.areaWidth}
          height={dimensions.areaHeight}
        />

        <div className="ck-picker-controls">
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

          {showInputs && (
            <div className="ck-inputs">
              {availableModes.length > 1 && (
                <div className="ck-input-modes">
                  {availableModes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setInputMode(mode)}
                      className={`ck-input-mode-btn ${validInputMode === mode ? 'active' : ''}`}
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
                colorValue={colorValue}
                size="lg"
                className="ck-preview-wide"
              />
              <div className="ck-action-buttons">
                {validInputMode === 'single' && (
                  <select
                    value={validFormat}
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
              {validInputMode === 'single' && (
                <div className="ck-input-row">
                  <input
                    type="text"
                    value={formatColor(colorValue, validFormat)}
                    onChange={(e) => setFromString(e.target.value)}
                    className="ck-input"
                    data-testid="color-input-text"
                  />
                  {showCopyButton && (
                    <CopyButton
                      text={formatColor(colorValue, validFormat)}
                      onCopy={handleCopy}
                    />
                  )}
                </div>
              )}
              {validInputMode === 'rgb' && (
                <RGBInputs
                  colorValue={colorValue}
                  onChange={setFromString}
                  showAlpha={showAlpha}
                />
              )}
              {validInputMode === 'hsl' && (
                <HSLInputs
                  colorValue={colorValue}
                  onChange={setFromString}
                  showAlpha={showAlpha}
                />
              )}
              {validInputMode === 'hsv' && (
                <HSVInputs
                  colorValue={colorValue}
                  onChange={setFromString}
                  showAlpha={showAlpha}
                />
              )}
              {validInputMode === 'oklch' && (
                <OKLCHInputs
                  colorValue={colorValue}
                  onChange={setFromString}
                  showAlpha={showAlpha}
                />
              )}
            </div>
          )}

          {enableHistory && history.length > 0 && (
            <RecentColors colors={history} onColorSelect={handlePresetSelect} />
          )}

          {showPresets && customPresets.length > 0 && (
            <div className="ck-presets">
              <PresetColors
                colors={customPresets}
                selectedColor={colorValue.hex}
                onSelect={handlePresetSelect}
                onUpdatePreset={(index) =>
                  handleUpdatePreset(index, colorValue.hex)
                }
                onDeletePreset={handleDeletePreset}
                onAddPreset={handleAddPreset}
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
