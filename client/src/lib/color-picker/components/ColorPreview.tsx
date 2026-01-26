import { useMemo } from 'react';
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
      className={`ck-preview ${sizeClass} ck-checkerboard ${className}`}
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
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorSwatch({
  color,
  selected = false,
  onClick,
  size = 'sm',
  className = '',
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ck-swatch ck-checkerboard ${selected ? 'selected' : ''} ${className}`}
      data-testid="color-swatch"
    >
      <div
        className="ck-swatch-color"
        style={{ backgroundColor: color }}
      />
    </button>
  );
}

interface PresetColorsProps {
  colors: string[];
  selectedColor?: string;
  onSelect: (color: string) => void;
  className?: string;
}

export function PresetColors({
  colors,
  selectedColor,
  onSelect,
  className = '',
}: PresetColorsProps) {
  return (
    <div className={`ck-presets-grid ${className}`} data-testid="preset-colors">
      {colors.map((color, index) => (
        <ColorSwatch
          key={`${color}-${index}`}
          color={color}
          selected={selectedColor?.toLowerCase() === color.toLowerCase()}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
}
