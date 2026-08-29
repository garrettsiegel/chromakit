import type { ColorFormat, ColorValue } from '../types';
import { formatColor } from '../conversions';
import { RGBInputs } from './RGBInputs';
import { HSLInputs } from './HSLInputs';
import { HSVInputs } from './HSVInputs';
import { OKLCHInputs } from './OKLCHInputs';
import { OKLABInputs } from './OKLABInputs';
import { CopyButton } from './CopyButton';

export type InputMode = 'single' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab';

interface InputValuePanelProps {
  inputMode: InputMode;
  colorValue: ColorValue;
  format: ColorFormat;
  setFromString: (colorString: string) => unknown;
  showAlpha: boolean;
  showCopyButton: boolean;
  onCopy: (success: boolean) => void;
}

// The per-mode channel editors. Split out of PickerLayout so each file stays
// focused on one job: layout there, value editing here.
export function InputValuePanel({
  inputMode,
  colorValue,
  format,
  setFromString,
  showAlpha,
  showCopyButton,
  onCopy,
}: InputValuePanelProps) {
  if (inputMode === 'single') {
    const text = formatColor(colorValue, format);
    return (
      <div className="ck-input-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setFromString(e.target.value)}
          className="ck-input"
          data-testid="color-input-text"
        />
        {showCopyButton && <CopyButton text={text} onCopy={onCopy} />}
      </div>
    );
  }

  const shared = {
    colorValue,
    onChange: setFromString,
    showAlpha,
  };

  switch (inputMode) {
    case 'rgb':
      return <RGBInputs {...shared} />;
    case 'hsl':
      return <HSLInputs {...shared} />;
    case 'hsv':
      return <HSVInputs {...shared} />;
    case 'oklch':
      return <OKLCHInputs {...shared} />;
    case 'oklab':
      return <OKLABInputs {...shared} />;
    default:
      return null;
  }
}
