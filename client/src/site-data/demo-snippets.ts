export const controlledCode = `const [color, setColor] = useState('#6366F1');

<ColorPicker
  value={color}
  onChange={(c) => setColor(c.hex8)}
  onChangeComplete={(c) => console.log('final', c.oklch)}
/>`;

export const presetCode = `<ColorPicker
  defaultValue="#22c55e"
  presets={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7']}
/>`;

export const wideCode = `<ColorPicker layout="wide" />`;

export const formatCode = `<ColorPicker
  defaultValue="#3b82f6"
  formats={['hex', 'rgb', 'oklch']}
/>`;

export const buildYourOwnCode = `import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
  useColorState,
} from 'chromakit-react';

export const CustomPicker = () => {
  const { hsva, colorValue, updateColor, startDrag, endDrag } =
    useColorState('#6366F1');

  return (
    <div className="custom-picker">
      <ColorArea
        hsva={hsva}
        onChange={updateColor}
        onStart={startDrag}
        onEnd={endDrag}
      />
      <HueSlider hsva={hsva} onChange={updateColor} />
      <AlphaSlider hsva={hsva} onChange={updateColor} />
      <ColorPreview colorValue={colorValue} size="lg" />
    </div>
  );
};`;

export const converterCode = `import { parseColor, rgbaToColorValue, formatColor } from 'chromakit-react';

const rgba = parseColor('#6366F1');          // { r, g, b, a }
const value = rgbaToColorValue(rgba);         // every format
const oklch = formatColor(value, 'oklch');    // "oklch(55% 0.22 277)"`;
