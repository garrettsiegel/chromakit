import {
  ColorArea,
  HueSlider,
  ColorPreview,
  useColorState,
} from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

export const HookDemoCard = () => {
  const { hsva, colorValue, updateColor, startDrag, endDrag } =
    useColorState('#6366F1');
  return (
    <DemoCard label="useColorState + primitives">
      <div className="demo-stack demo-stack--sm">
        <ColorArea
          hsva={hsva}
          onChange={updateColor}
          onStart={startDrag}
          onEnd={endDrag}
          height={140}
        />
        <HueSlider hsva={hsva} onChange={updateColor} />
        <div className="demo-row">
          <ColorPreview colorValue={colorValue} />
          <code>{colorValue.hex}</code>
        </div>
      </div>
    </DemoCard>
  );
};
