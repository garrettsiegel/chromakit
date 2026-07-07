import { useState, useCallback, useMemo } from 'react';
import type { ColorValue, ColorFormat } from '../types';
import { parseColor, formatColor } from '../conversions';

interface ColorInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  format: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  showAlpha?: boolean;
  availableFormats?: ColorFormat[];
  className?: string;
}

const ALL_FORMATS: {
  value: ColorFormat;
  label: string;
  needsAlpha?: boolean;
}[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'hex8', label: 'HEX8', needsAlpha: true },
  { value: 'rgb', label: 'RGB' },
  { value: 'rgba', label: 'RGBA', needsAlpha: true },
  { value: 'hsl', label: 'HSL' },
  { value: 'hsla', label: 'HSLA', needsAlpha: true },
  { value: 'hsv', label: 'HSV' },
  { value: 'hsva', label: 'HSVA', needsAlpha: true },
  { value: 'oklch', label: 'OKLCH' },
  { value: 'oklcha', label: 'OKLCHA', needsAlpha: true },
  { value: 'oklab', label: 'OKLAB' },
];

export function ColorInputs({
  colorValue,
  onChange,
  format,
  onFormatChange,
  showAlpha = true,
  availableFormats,
  className = '',
}: ColorInputsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState('');

  const derivedValue = useMemo(
    () => formatColor(colorValue, format),
    [colorValue, format]
  );

  const inputValue = isEditing ? draftValue : derivedValue;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDraftValue(value);
      setIsEditing(true);

      // PASS THE ORIGINAL STRING THROUGH SO THE USER'S FORMAT IS PRESERVED
      const parsed = parseColor(value);
      if (parsed) {
        onChange(value);
      }
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    if (!parseColor(draftValue)) {
      setDraftValue(derivedValue);
    }
    setIsEditing(false);
  }, [draftValue, derivedValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        const parsed = parseColor(inputValue);
        if (!parsed) {
          setDraftValue(derivedValue);
        }
        setIsEditing(false);
      }
    },
    [inputValue, derivedValue]
  );

  return (
    <div className={`ck-inputs ${className}`}>
      <div className="ck-input-row">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="ck-input"
          data-testid="color-input-text"
        />
        {onFormatChange && (
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value as ColorFormat)}
            className="ck-select"
            data-testid="color-format-select"
          >
            {ALL_FORMATS.filter((f) => {
              if (availableFormats && !availableFormats.includes(f.value)) {
                return false;
              }
              if (f.needsAlpha && !showAlpha) {
                return false;
              }
              return true;
            }).map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
