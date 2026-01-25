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
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const currentColorStyle = useMemo(
    () => ({
      backgroundColor: `rgba(${colorValue.rgba.r}, ${colorValue.rgba.g}, ${colorValue.rgba.b}, ${colorValue.rgba.a})`,
    }),
    [colorValue]
  );

  if (showComparison && originalColor) {
    return (
      <div className={`flex rounded-md overflow-hidden shadow-sm border border-border ${className}`}>
        <div
          className={`${sizeClasses[size]} color-picker-checkerboard relative`}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: originalColor }}
          />
        </div>
        <div
          className={`${sizeClasses[size]} color-picker-checkerboard relative`}
        >
          <div className="absolute inset-0" style={currentColorStyle} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-md color-picker-checkerboard relative shadow-sm border border-border overflow-hidden ${className}`}
      data-testid="color-preview"
    >
      <div className="absolute inset-0" style={currentColorStyle} />
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
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-md color-picker-checkerboard relative cursor-pointer border-2 transition-all ${
        selected
          ? 'border-primary ring-2 ring-primary/30 scale-110'
          : 'border-transparent hover:scale-105'
      } ${className}`}
      data-testid="color-swatch"
    >
      <div
        className="absolute inset-0 rounded-[4px]"
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
    <div className={`flex flex-wrap gap-1.5 ${className}`} data-testid="preset-colors">
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
