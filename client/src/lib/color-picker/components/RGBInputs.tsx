import { useCallback, useMemo } from 'react';
import type { ColorValue } from '../types';
import { ChannelInputs, type ChannelConfig } from './ChannelInputs';

interface RGBInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

const CHANNELS: ChannelConfig<'r' | 'g' | 'b' | 'a'>[] = [
  { key: 'r', label: 'r', inputId: 'ck-rgb-input-r', testId: 'rgb-input-r', min: 0, max: 255, format: (v) => v },
  { key: 'g', label: 'g', inputId: 'ck-rgb-input-g', testId: 'rgb-input-g', min: 0, max: 255, format: (v) => v },
  { key: 'b', label: 'b', inputId: 'ck-rgb-input-b', testId: 'rgb-input-b', min: 0, max: 255, format: (v) => v },
  { key: 'a', label: 'A', inputId: 'ck-rgb-input-a', testId: 'rgb-input-a', min: 0, max: 1, step: 0.01, format: (v) => v },
];

export function RGBInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: RGBInputsProps) {
  const channels = useMemo(
    () => (showAlpha ? CHANNELS : CHANNELS.slice(0, 3)),
    [showAlpha]
  );

  const handleChannelChange = useCallback(
    (key: string, value: number) => {
      const next = {
        ...colorValue.rgba,
        [key]: key === 'a' ? value : Math.round(value),
      };
      onChange(`rgba(${next.r}, ${next.g}, ${next.b}, ${next.a})`);
    },
    [colorValue.rgba, onChange]
  );

  return (
    <ChannelInputs
      channels={channels}
      values={colorValue.rgba}
      onChannelChange={handleChannelChange}
      className={className}
    />
  );
}
