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
      <div className={`ck-preview ck-preview--comparison ${className}`}>
        <div className={`${sizeClass} ck-checkerboard ck-preview-half`}>
          <div
            className="ck-preview-color"
            style={{ backgroundColor: originalColor }}
          />
        </div>
        <div className={`${sizeClass} ck-checkerboard ck-preview-half`}>
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
