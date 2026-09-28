import { useState, useCallback, useMemo } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { ColorValue, ColorFormat } from '../types';
import { parseColor, formatColor } from '../conversions';
import { CopyButton } from './CopyButton';
import { COLOR_FORMATS, hasAlpha } from './formats';

export interface ColorInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  format: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  showAlpha?: boolean;
  availableFormats?: ColorFormat[];
  className?: string;
  showCopyButton?: boolean;
  onCopy?: (success: boolean) => void;
}

// THIS SELECT HAS ALWAYS LISTED OKLCH BEFORE OKLAB
const SELECT_FORMATS: ColorFormat[] = [
  ...COLOR_FORMATS.filter((f) => !f.startsWith('oklab')),
  ...COLOR_FORMATS.filter((f) => f.startsWith('oklab')),
];

export function ColorInputs({
  colorValue,
  onChange,
  format,
  onFormatChange,
  showAlpha = true,
  availableFormats,
  className = '',
  showCopyButton = false,
  onCopy,
}: ColorInputsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState('');

  const derivedValue = useMemo(
    () => formatColor(colorValue, format),
    [colorValue, format]
  );

  const inputValue = isEditing ? draftValue : derivedValue;

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
    (e: KeyboardEvent) => {
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
    <div className={`ck-inputs ${className}`.trim()}>
      <div className="ck-input-row">
        <input
          type="text"
          aria-label={`Color value in ${format.toUpperCase()} format`}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="ck-input"
          data-testid="color-input-text"
        />
        {onFormatChange && (
          <select
            aria-label="Color format"
            value={format}
            onChange={(e) => onFormatChange(e.target.value as ColorFormat)}
            className="ck-select"
            data-testid="color-format-select"
          >
            {SELECT_FORMATS.filter(
              (f) =>
                (!availableFormats || availableFormats.includes(f)) &&
                (showAlpha || !hasAlpha(f))
            ).map((f) => (
              <option key={f} value={f}>
                {f.toUpperCase()}
              </option>
            ))}
          </select>
        )}
        {showCopyButton && <CopyButton text={derivedValue} onCopy={onCopy} />}
      </div>
    </div>
  );
}
