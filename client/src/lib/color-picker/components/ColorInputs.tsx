import { useState, useCallback, useEffect } from 'react';
import type { ColorValue, ColorFormat } from '../types';
import { parseColor, rgbaToColorValue, formatColor } from '../conversions';

interface ColorInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  format: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  showAlpha?: boolean;
  availableFormats?: ColorFormat[];
  className?: string;
}

// All possible formats for the dropdown
const ALL_FORMATS: { value: ColorFormat; label: string; needsAlpha?: boolean }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'hex8', label: 'HEX8', needsAlpha: true },
  { value: 'rgb', label: 'RGB' },
  { value: 'rgba', label: 'RGBA', needsAlpha: true },
  { value: 'hsl', label: 'HSL' },
  { value: 'hsla', label: 'HSLA', needsAlpha: true },
  { value: 'oklch', label: 'OKLCH' },
  { value: 'oklcha', label: 'OKLCHA', needsAlpha: true },
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
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(formatColor(colorValue, format));
    }
  }, [colorValue, format, isEditing]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsEditing(true);
    
    // Only validate the color, pass the original input to preserve user's format
    const parsed = parseColor(value);
    if (parsed) {
      // Pass through the original input string to preserve the user's intended format
      onChange(value);
    }
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setInputValue(formatColor(colorValue, format));
  }, [colorValue, format]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      const parsed = parseColor(inputValue);
      if (!parsed) {
        setInputValue(formatColor(colorValue, format));
      }
    }
  }, [inputValue, colorValue, format]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          data-testid="color-input-text"
        />
        {onFormatChange && (
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value as ColorFormat)}
            className="px-2 py-2 text-sm bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            data-testid="color-format-select"
          >
            {ALL_FORMATS.filter((f) => {
              // Filter by available formats if provided
              if (availableFormats && !availableFormats.includes(f.value)) {
                return false;
              }
              // Filter alpha formats if alpha not enabled
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

interface RGBInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

export function RGBInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: RGBInputsProps) {
  const [values, setValues] = useState({
    r: colorValue.rgba.r,
    g: colorValue.rgba.g,
    b: colorValue.rgba.b,
    a: colorValue.rgba.a,
  });

  useEffect(() => {
    setValues({
      r: colorValue.rgba.r,
      g: colorValue.rgba.g,
      b: colorValue.rgba.b,
      a: colorValue.rgba.a,
    });
  }, [colorValue]);

  const handleChange = useCallback((key: 'r' | 'g' | 'b' | 'a', value: string) => {
    const numValue = key === 'a' ? parseFloat(value) || 0 : parseInt(value) || 0;
    const clamped = key === 'a' 
      ? Math.max(0, Math.min(1, numValue))
      : Math.max(0, Math.min(255, numValue));
    
    const newValues = { ...values, [key]: clamped };
    setValues(newValues);
    onChange(`rgba(${newValues.r}, ${newValues.g}, ${newValues.b}, ${newValues.a})`);
  }, [values, onChange]);

  return (
    <div className={`grid gap-2 ${showAlpha ? 'grid-cols-4' : 'grid-cols-3'} ${className}`}>
      {(['r', 'g', 'b'] as const).map((key) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase font-medium">
            {key}
          </label>
          <input
            type="number"
            min={0}
            max={255}
            value={values[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
            data-testid={`rgb-input-${key}`}
          />
        </div>
      ))}
      {showAlpha && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase font-medium">
            A
          </label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={values.a}
            onChange={(e) => handleChange('a', e.target.value)}
            className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
            data-testid="rgb-input-a"
          />
        </div>
      )}
    </div>
  );
}

interface HSLInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

export function HSLInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: HSLInputsProps) {
  const [values, setValues] = useState({
    h: colorValue.hsla.h,
    s: colorValue.hsla.s,
    l: colorValue.hsla.l,
    a: colorValue.hsla.a,
  });

  useEffect(() => {
    setValues({
      h: colorValue.hsla.h,
      s: colorValue.hsla.s,
      l: colorValue.hsla.l,
      a: colorValue.hsla.a,
    });
  }, [colorValue]);

  const handleChange = useCallback((key: 'h' | 's' | 'l' | 'a', value: string) => {
    const numValue = parseFloat(value) || 0;
    let clamped: number;
    if (key === 'a') clamped = Math.max(0, Math.min(1, numValue));
    else if (key === 'h') clamped = Math.max(0, Math.min(360, numValue));
    else clamped = Math.max(0, Math.min(100, numValue));
    
    const newValues = { ...values, [key]: clamped };
    setValues(newValues);
    onChange(`hsla(${newValues.h}, ${newValues.s}%, ${newValues.l}%, ${newValues.a})`);
  }, [values, onChange]);

  return (
    <div className={`grid gap-2 ${showAlpha ? 'grid-cols-4' : 'grid-cols-3'} ${className}`}>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">H</label>
        <input
          type="number"
          min={0}
          max={360}
          value={Math.round(values.h)}
          onChange={(e) => handleChange('h', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="hsl-input-h"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">S</label>
        <input
          type="number"
          min={0}
          max={100}
          value={Math.round(values.s)}
          onChange={(e) => handleChange('s', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="hsl-input-s"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">L</label>
        <input
          type="number"
          min={0}
          max={100}
          value={Math.round(values.l)}
          onChange={(e) => handleChange('l', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="hsl-input-l"
        />
      </div>
      {showAlpha && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase font-medium">A</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={values.a}
            onChange={(e) => handleChange('a', e.target.value)}
            className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
            data-testid="hsl-input-a"
          />
        </div>
      )}
    </div>
  );
}

interface HSVInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

export function HSVInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: HSVInputsProps) {
  const [values, setValues] = useState({
    h: colorValue.hsva.h,
    s: colorValue.hsva.s,
    v: colorValue.hsva.v,
    a: colorValue.hsva.a,
  });

  useEffect(() => {
    setValues({
      h: colorValue.hsva.h,
      s: colorValue.hsva.s,
      v: colorValue.hsva.v,
      a: colorValue.hsva.a,
    });
  }, [colorValue]);

  const handleChange = useCallback((key: 'h' | 's' | 'v' | 'a', value: string) => {
    const numValue = parseFloat(value) || 0;
    let clamped: number;
    if (key === 'a') clamped = Math.max(0, Math.min(1, numValue));
    else if (key === 'h') clamped = Math.max(0, Math.min(360, numValue));
    else clamped = Math.max(0, Math.min(100, numValue));
    
    const newValues = { ...values, [key]: clamped };
    setValues(newValues);
    // Convert HSV to HSLA for parsing (using same hue, saturation as brightness)
    const h = newValues.h;
    const s = newValues.s;
    const v = newValues.v;
    // HSV to HSL conversion
    const l = v * (1 - s / 200);
    const sl = l === 0 || l === 100 ? 0 : (v - l) / Math.min(l, 100 - l) * 100;
    onChange(`hsla(${h}, ${sl}%, ${l}%, ${newValues.a})`);
  }, [values, onChange]);

  return (
    <div className={`grid gap-2 ${showAlpha ? 'grid-cols-4' : 'grid-cols-3'} ${className}`}>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">H</label>
        <input
          type="number"
          min={0}
          max={360}
          value={Math.round(values.h)}
          onChange={(e) => handleChange('h', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="hsv-input-h"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">S</label>
        <input
          type="number"
          min={0}
          max={100}
          value={Math.round(values.s)}
          onChange={(e) => handleChange('s', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="hsv-input-s"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">V</label>
        <input
          type="number"
          min={0}
          max={100}
          value={Math.round(values.v)}
          onChange={(e) => handleChange('v', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="hsv-input-v"
        />
      </div>
      {showAlpha && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase font-medium">A</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={values.a}
            onChange={(e) => handleChange('a', e.target.value)}
            className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
            data-testid="hsv-input-a"
          />
        </div>
      )}
    </div>
  );
}

interface OKLCHInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

export function OKLCHInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: OKLCHInputsProps) {
  const [values, setValues] = useState({
    L: colorValue.oklcha.L,
    C: colorValue.oklcha.C,
    h: colorValue.oklcha.h,
    a: colorValue.oklcha.a,
  });

  useEffect(() => {
    setValues({
      L: colorValue.oklcha.L,
      C: colorValue.oklcha.C,
      h: colorValue.oklcha.h,
      a: colorValue.oklcha.a,
    });
  }, [colorValue]);

  const handleChange = useCallback((key: 'L' | 'C' | 'h' | 'a', value: string) => {
    const numValue = parseFloat(value) || 0;
    let clamped: number;
    if (key === 'a') clamped = Math.max(0, Math.min(1, numValue));
    else if (key === 'L') clamped = Math.max(0, Math.min(1, numValue));
    else if (key === 'C') clamped = Math.max(0, Math.min(0.4, numValue));
    else clamped = Math.max(0, Math.min(360, numValue));
    
    const newValues = { ...values, [key]: clamped };
    setValues(newValues);
    onChange(`oklch(${newValues.L} ${newValues.C} ${newValues.h} / ${newValues.a})`);
  }, [values, onChange]);

  return (
    <div className={`grid gap-2 ${showAlpha ? 'grid-cols-4' : 'grid-cols-3'} ${className}`}>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">L</label>
        <input
          type="number"
          min={0}
          max={1}
          step={0.01}
          value={values.L.toFixed(2)}
          onChange={(e) => handleChange('L', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="oklch-input-l"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">C</label>
        <input
          type="number"
          min={0}
          max={0.4}
          step={0.001}
          value={values.C.toFixed(3)}
          onChange={(e) => handleChange('C', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="oklch-input-c"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground uppercase font-medium">H</label>
        <input
          type="number"
          min={0}
          max={360}
          value={Math.round(values.h)}
          onChange={(e) => handleChange('h', e.target.value)}
          className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
          data-testid="oklch-input-h"
        />
      </div>
      {showAlpha && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase font-medium">A</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={values.a.toFixed(2)}
            onChange={(e) => handleChange('a', e.target.value)}
            className="px-2 py-1.5 text-sm font-mono bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
            data-testid="oklch-input-a"
          />
        </div>
      )}
    </div>
  );
}
