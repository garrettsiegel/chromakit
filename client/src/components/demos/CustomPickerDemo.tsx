import * as Tabs from '@radix-ui/react-tabs';
import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
  RGBInputs,
  HSLInputs,
  HSVInputs,
  OKLCHInputs,
  useColorState,
} from '@/lib/color-picker';
import { ColorFormatsDisplay } from '@/components/shared/ColorFormatsDisplay';

const EDITORS = [
  { value: 'rgb', label: 'RGB', Inputs: RGBInputs },
  { value: 'hsl', label: 'HSL', Inputs: HSLInputs },
  { value: 'hsv', label: 'HSV', Inputs: HSVInputs },
  { value: 'oklch', label: 'OKLCH', Inputs: OKLCHInputs },
];

export const CustomPickerDemo = () => {
  const { hsva, colorValue, updateColor, setFromString, startDrag, endDrag } =
    useColorState('#6366F1');
  const drag = { onStart: startDrag, onEnd: endDrag };

  return (
    <div className="demo-stack demo-stack--md">
      <ColorArea
        hsva={hsva}
        onChange={updateColor}
        width={320}
        height={160}
        {...drag}
      />
      <div className="demo-row demo-row--top">
        <ColorPreview colorValue={colorValue} size="lg" />
        <div className="demo-stack demo-row__fill">
          <HueSlider hsva={hsva} onChange={updateColor} {...drag} />
          <AlphaSlider hsva={hsva} onChange={updateColor} {...drag} />
        </div>
      </div>
      <Tabs.Root defaultValue="rgb">
        <Tabs.List
          className="tabs__list tabs__list--fill"
          aria-label="Channel editor"
        >
          {EDITORS.map(({ value, label }) => (
            <Tabs.Trigger key={value} className="tabs__trigger" value={value}>
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {EDITORS.map(({ value, Inputs }) => (
          <Tabs.Content key={value} className="tabs__panel" value={value}>
            <Inputs colorValue={colorValue} onChange={setFromString} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <ColorFormatsDisplay colorValue={colorValue} />
    </div>
  );
};
