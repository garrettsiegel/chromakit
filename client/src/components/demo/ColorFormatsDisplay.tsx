import { memo } from 'react';
import type { ColorFormat, ColorValue } from '@/lib/color-picker';
import { formatColor } from '@/lib/color-picker';
import { CopyButton } from './CopyButton';

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

export const ColorFormatsDisplay = memo(function ColorFormatsDisplay({ colorValue }: ColorFormatsDisplayProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {COLOR_FORMATS.map((format) => {
        const formatted = formatColor(colorValue, format);
        return (
          <div
            key={format}
            className="flex items-center justify-between gap-2 p-2 bg-secondary/30 rounded-md"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase w-14">
              {format}
            </span>
            <code className="flex-1 text-xs font-mono truncate">
              {formatted}
            </code>
            <CopyButton text={formatted} />
          </div>
        );
      })}
    </div>
  );
});
