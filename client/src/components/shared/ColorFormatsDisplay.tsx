import { memo } from 'react';
import type { ColorFormat, ColorValue } from '@/lib/color-picker';
import { formatColor } from '@/lib/color-picker';
import { CopyIconButton } from './CopyIconButton';

const COLOR_FORMATS: ColorFormat[] = [
  'hex',
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'oklch',
  'oklcha',
];

interface ColorFormatsDisplayProps {
  colorValue: ColorValue;
}

export const ColorFormatsDisplay = memo(function ColorFormatsDisplay({
  colorValue,
}: ColorFormatsDisplayProps) {
  return (
    <div className="format-ledger">
      {COLOR_FORMATS.map((format) => {
        const formatted = formatColor(colorValue, format);
        return (
          <div key={format} className="format-ledger__row">
            <span className="format-ledger__label">{format}</span>
            <code>{formatted}</code>
            <CopyIconButton text={formatted} />
          </div>
        );
      })}
    </div>
  );
});
