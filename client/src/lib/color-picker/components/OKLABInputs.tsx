import { useCallback, useMemo } from 'react';
import type { ColorValue } from '../types';
import { ChannelInputs, type ChannelConfig } from './ChannelInputs';

interface OKLABInputsProps {
  colorValue: ColorValue;
  onChange: (colorString: string) => void;
  showAlpha?: boolean;
  className?: string;
}

// The a/b axes run roughly -0.4 to 0.4; alpha is keyed `alpha` because OKLab
// already uses `a` for its green-red axis.
const CHANNELS: ChannelConfig<'L' | 'a' | 'b' | 'alpha'>[] = [
  {
    key: 'L',
    label: 'L',
    inputId: 'ck-oklab-input-l',
    testId: 'oklab-input-l',
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    key: 'a',
    label: 'a',
    inputId: 'ck-oklab-input-a',
    testId: 'oklab-input-a',
    min: -0.4,
    max: 0.4,
    step: 0.001,
    format: (v) => v.toFixed(3),
  },
  {
    key: 'b',
    label: 'b',
    inputId: 'ck-oklab-input-b',
    testId: 'oklab-input-b',
    min: -0.4,
    max: 0.4,
    step: 0.001,
    format: (v) => v.toFixed(3),
  },
  {
    key: 'alpha',
    label: 'A',
    inputId: 'ck-oklab-input-alpha',
    testId: 'oklab-input-alpha',
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
];

export function OKLABInputs({
  colorValue,
  onChange,
  showAlpha = true,
  className = '',
}: OKLABInputsProps) {
  const channels = useMemo(
    () => (showAlpha ? CHANNELS : CHANNELS.slice(0, 3)),
    [showAlpha]
  );

  const handleChannelChange = useCallback(
    (key: string, value: number) => {
      const next = { ...colorValue.oklaba, [key]: value };
      onChange(`oklab(${next.L} ${next.a} ${next.b} / ${next.alpha})`);
    },
    [colorValue.oklaba, onChange]
  );

  return (
    <ChannelInputs
      channels={channels}
      values={colorValue.oklaba}
      onChannelChange={handleChannelChange}
      className={className}
    />
  );
}
