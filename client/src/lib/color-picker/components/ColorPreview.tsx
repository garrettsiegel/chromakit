import { useMemo, useState } from 'react';
import type { ColorValue } from '../types';

interface ColorPreviewProps {
  colorValue: ColorValue;
  showComparison?: boolean;
  originalColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorPreview({
  colorValue,
  showComparison = false,
  originalColor,
  size = 'md',
  className = '',
}: ColorPreviewProps) {
  const sizeClass = `ck-preview-${size}`;

  const currentColorStyle = useMemo(
    () => ({
      backgroundColor: `rgba(${colorValue.rgba.r}, ${colorValue.rgba.g}, ${colorValue.rgba.b}, ${colorValue.rgba.a})`,
    }),
    [colorValue]
  );

  if (showComparison && originalColor) {
    return (
      <div className={`ck-preview ${className}`} style={{ display: 'flex', overflow: 'hidden' }}>
        <div
          className={`${sizeClass} ck-checkerboard`}
          style={{ position: 'relative' }}
        >
          <div
            className="ck-preview-color"
            style={{ backgroundColor: originalColor }}
          />
        </div>
        <div
          className={`${sizeClass} ck-checkerboard`}
          style={{ position: 'relative' }}
        >
          <div className="ck-preview-color" style={currentColorStyle} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ck-preview ${sizeClass} ${className}`}
      data-testid="color-preview"
    >
      <div className="ck-preview-color" style={currentColorStyle} />
    </div>
  );
}

interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  editing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorSwatch({
  color,
  selected = false,
  onClick,
  onLongPress,
  onDelete,
  editing = false,
  size = 'sm',
  className = '',
}: ColorSwatchProps) {
  let pressTimer: NodeJS.Timeout | null = null;

  const handleMouseDown = () => {
    if (onLongPress) {
      pressTimer = setTimeout(() => {
        onLongPress();
      }, 500);
    }
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    onClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={`ck-swatch-btn ${selected ? 'selected' : ''} ${editing ? 'ck-swatch-editing' : ''} ${className}`}
      data-testid="color-swatch"
      title={editing ? "Click to update color" : (onLongPress ? "Click to select, hold to update with current color" : color)}
    >
      <div
        className="ck-swatch-color"
        style={{ backgroundColor: color }}
      />
      {editing && onDelete && (
        <span
          className="ck-swatch-delete-btn"
          onClick={handleDelete}
          title="Delete preset"
        >
          ×
        </span>
      )}
    </button>
  );
}

interface PresetColorsProps {
  colors: string[];
  selectedColor?: string;
  onSelect: (color: string) => void;
  onUpdatePreset?: (index: number) => void;
  onDeletePreset?: (index: number) => void;
  onAddPreset?: () => void;
  currentColor?: string;
  editable?: boolean;
  className?: string;
}

export function PresetColors({
  colors,
  selectedColor,
  onSelect,
  onUpdatePreset,
  onDeletePreset,
  onAddPreset,
  currentColor,
  editable = true,
  className = '',
}: PresetColorsProps) {
  const [isEditing, setIsEditing] = useState(false);

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
          <button
            type="button"
            className="ck-presets-edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? 'Done editing' : 'Edit presets'}
          >
            {isEditing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            )}
          </button>
        </div>
      )}
      <div className={`ck-preset-colors ${className}`} data-testid="preset-colors">
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${color}-${index}`}
            color={color}
            selected={selectedColor?.toLowerCase() === color.toLowerCase()}
            onClick={() => handleSwatchClick(color, index)}
            onLongPress={onUpdatePreset && !isEditing ? () => onUpdatePreset(index) : undefined}
            onDelete={isEditing && onDeletePreset ? () => onDeletePreset(index) : undefined}
            editing={isEditing}
          />
        ))}
        {isEditing && onAddPreset && colors.length < 24 && (
          <button
            type="button"
            className="ck-swatch-btn ck-swatch-add"
            onClick={onAddPreset}
            title="Add current color as preset"
          >
            <span style={{ fontSize: '24px', color: 'var(--ck-text-muted)' }}>+</span>
          </button>
        )}
      </div>
    </>
  );
}
