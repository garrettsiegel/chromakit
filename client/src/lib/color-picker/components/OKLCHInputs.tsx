import { useCallback, useMemo } from 'react';
import type { ColorValue } from '../types';
import { ChannelInputs, type ChannelConfig } from './ChannelInputs';

interface OKLCHInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

const CHANNELS: ChannelConfig<'L' | 'C' | 'h' | 'a'>[] = [
  { key: 'L', label: 'L', inputId: 'ck-oklch-input-l', testId: 'oklch-input-l', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'C', label: 'C', inputId: 'ck-oklch-input-c', testId: 'oklch-input-c', min: 0, max: 0.4, step: 0.001, format: (v) => v.toFixed(3) },
  { key: 'h', label: 'H', inputId: 'ck-oklch-input-h', testId: 'oklch-input-h', min: 0, max: 360, format: (v) => Math.round(v) },
  { key: 'a', label: 'A', inputId: 'ck-oklch-input-a', testId: 'oklch-input-a', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
];

export function OKLCHInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: OKLCHInputsProps) {
  const channels = useMemo(
    () => (showAlpha ? CHANNELS : CHANNELS.slice(0, 3)),
    [showAlpha]
  );

  const handleChannelChange = useCallback(
    (key: string, value: number) => {
      const next = { ...colorValue.oklcha, [key]: value };
      onChange(`oklch(${next.L} ${next.C} ${next.h} / ${next.a})`);
    },
    [colorValue.oklcha, onChange]
  );

  return (
    <ChannelInputs
      channels={channels}
      values={colorValue.oklcha}
      onChannelChange={handleChannelChange}
      className={className}
    />
  );
}
