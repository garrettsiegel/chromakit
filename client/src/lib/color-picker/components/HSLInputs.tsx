import { useCallback, useMemo } from 'react';
import type { ColorValue } from '../types';
import { ChannelInputs, type ChannelConfig } from './ChannelInputs';

interface HSLInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

const CHANNELS: ChannelConfig<'h' | 's' | 'l' | 'a'>[] = [
  { key: 'h', label: 'H', inputId: 'ck-hsl-input-h', testId: 'hsl-input-h', min: 0, max: 360, format: (v) => Math.round(v) },
  { key: 's', label: 'S', inputId: 'ck-hsl-input-s', testId: 'hsl-input-s', min: 0, max: 100, format: (v) => Math.round(v) },
  { key: 'l', label: 'L', inputId: 'ck-hsl-input-l', testId: 'hsl-input-l', min: 0, max: 100, format: (v) => Math.round(v) },
  { key: 'a', label: 'A', inputId: 'ck-hsl-input-a', testId: 'hsl-input-a', min: 0, max: 1, step: 0.01, format: (v) => v },
];

export function HSLInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: HSLInputsProps) {
  const channels = useMemo(
    () => (showAlpha ? CHANNELS : CHANNELS.slice(0, 3)),
    [showAlpha]
  );

  const handleChannelChange = useCallback(
    (key: string, value: number) => {
      const next = { ...colorValue.hsla, [key]: value };
      onChange(`hsla(${next.h}, ${next.s}%, ${next.l}%, ${next.a})`);
    },
    [colorValue.hsla, onChange]
  );

  return (
    <ChannelInputs
      channels={channels}
      values={colorValue.hsla}
      onChannelChange={handleChannelChange}
      className={className}
    />
  );
}
