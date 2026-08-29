import type { ColorFormat, ColorValue } from '../types';
import { ColorInputs } from './ColorInputs';
import { RGBInputs } from './RGBInputs';
import { HSLInputs } from './HSLInputs';
import { HSVInputs } from './HSVInputs';
import { OKLCHInputs } from './OKLCHInputs';
import { OKLABInputs } from './OKLABInputs';

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
    return (
      <ColorInputs
        colorValue={colorValue}
        format={format}
        onChange={setFromString}
        showAlpha={showAlpha}
        showCopyButton={showCopyButton}
        onCopy={onCopy}
      />
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
