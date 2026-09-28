import type { ColorValue } from '../types';

export interface ColorPreviewProps {
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

  const currentColorStyle = {
    backgroundColor: `rgba(${colorValue.rgba.r}, ${colorValue.rgba.g}, ${colorValue.rgba.b}, ${colorValue.rgba.a})`,
  };

  if (showComparison && originalColor) {
    return (
      <div className={`ck-preview ck-preview--comparison ${className}`.trim()}>
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
      className={`ck-preview ${sizeClass} ${className}`.trim()}
      data-testid="color-preview"
    >
      <div className="ck-preview-color" style={currentColorStyle} />
    </div>
  );
}
