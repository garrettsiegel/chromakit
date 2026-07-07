import { useMemo, useState } from 'react';
import type { PresetGroup } from '../types';
import { ColorSwatch } from './ColorSwatch';

interface PresetColorsProps {
  colors: string[];
  selectedColor?: string;
  onSelect: (color: string) => void;
  onUpdatePreset?: (index: number) => void;
  onDeletePreset?: (index: number) => void;
  onAddPreset?: () => void;
  editable?: boolean;
  className?: string;
  presetGroups?: PresetGroup[];
  selectedPresetGroup?: string | null;
  onLoadPresetGroup?: (groupName: string) => void;
}

const MAX_PRESETS = 24;

export function PresetColors({
  colors,
  selectedColor,
  onSelect,
  onUpdatePreset,
  onDeletePreset,
  onAddPreset,
  editable = true,
  className = '',
  presetGroups,
  selectedPresetGroup,
  onLoadPresetGroup,
}: PresetColorsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const swatchEntries = useMemo(() => {
    const counts = new Map<string, number>();
    return colors.map((color) => {
      const occurrence = (counts.get(color) ?? 0) + 1;
      counts.set(color, occurrence);
      return { color, occurrence };
    });
  }, [colors]);

  const handleSwatchClick = (color: string, index: number) => {
    if (isEditing && onUpdatePreset) {
      onUpdatePreset(index);
    } else {
      onSelect(color);
    }
  };

  return (
    <>
      {editable && (
        <div className="ck-presets-header">
          <span className="ck-presets-title">Presets</span>
          <div className="ck-presets-header-controls">
            {presetGroups && presetGroups.length > 0 && (
              <select
                value={selectedPresetGroup || ''}
                onChange={(e) => {
                  if (e.target.value && onLoadPresetGroup) {
                    onLoadPresetGroup(e.target.value);
                  }
                }}
                className="ck-presets-dropdown"
                title="Load preset group"
                aria-label="Preset color group"
              >
                <option value="">Load presets...</option>
                {presetGroups.map((group) => (
                  <option key={group.name} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              className="ck-presets-edit-btn"
              onClick={() => setIsEditing(!isEditing)}
              title={isEditing ? 'Done editing' : 'Edit presets'}
              aria-label={isEditing ? 'Done editing' : 'Edit presets'}
            >
              {isEditing ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
      <div
        className={`ck-preset-colors ${className}`}
        data-testid="preset-colors"
      >
        {swatchEntries.map(({ color, occurrence }, index) => (
          <ColorSwatch
            key={`${color}-${occurrence}`}
            color={color}
            selected={selectedColor?.toLowerCase() === color.toLowerCase()}
            onClick={() => handleSwatchClick(color, index)}
            onLongPress={
              onUpdatePreset && !isEditing
                ? () => onUpdatePreset(index)
                : undefined
            }
            onDelete={
              isEditing && onDeletePreset
                ? () => onDeletePreset(index)
                : undefined
            }
            editing={isEditing}
          />
        ))}
        {isEditing && onAddPreset && colors.length < MAX_PRESETS && (
          <button
            type="button"
            className="ck-swatch-btn ck-swatch-add"
            onClick={onAddPreset}
            title="Add current color as preset"
          >
            <span className="ck-swatch-add-icon">+</span>
          </button>
        )}
      </div>
    </>
  );
}
