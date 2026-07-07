import { useCallback, useMemo } from 'react';
import type { ColorValue } from '../types';
import { ChannelInputs, type ChannelConfig } from './ChannelInputs';

interface HSVInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

const CHANNELS: ChannelConfig<'h' | 's' | 'v' | 'a'>[] = [
  { key: 'h', label: 'H', inputId: 'ck-hsv-input-h', testId: 'hsv-input-h', min: 0, max: 360, format: (v) => Math.round(v) },
  { key: 's', label: 'S', inputId: 'ck-hsv-input-s', testId: 'hsv-input-s', min: 0, max: 100, format: (v) => Math.round(v) },
  { key: 'v', label: 'V', inputId: 'ck-hsv-input-v', testId: 'hsv-input-v', min: 0, max: 100, format: (v) => Math.round(v) },
  { key: 'a', label: 'A', inputId: 'ck-hsv-input-a', testId: 'hsv-input-a', min: 0, max: 1, step: 0.01, format: (v) => v },
];

export function HSVInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: HSVInputsProps) {
  const channels = useMemo(
    () => (showAlpha ? CHANNELS : CHANNELS.slice(0, 3)),
    [showAlpha]
  );

  const handleChannelChange = useCallback(
    (key: string, value: number) => {
      const next = { ...colorValue.hsva, [key]: value };
      // EMIT AS HSLA BECAUSE parseColor HAS NO HSV SYNTAX; CONVERT HSV -> HSL
      const l = next.v * (1 - next.s / 200);
      const sl =
        l === 0 || l === 100 ? 0 : ((next.v - l) / Math.min(l, 100 - l)) * 100;
      onChange(`hsla(${next.h}, ${sl}%, ${l}%, ${next.a})`);
    },
    [colorValue.hsva, onChange]
  );

  return (
    <ChannelInputs
      channels={channels}
      values={colorValue.hsva}
      onChannelChange={handleChannelChange}
      className={className}
    />
  );
}
