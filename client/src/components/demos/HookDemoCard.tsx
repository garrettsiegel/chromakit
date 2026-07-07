import {
  ColorArea,
  HueSlider,
  ColorPreview,
  useColorState,
} from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

const useColorStateCode = `const {
  hsva,
  colorValue,
  updateColor,
  setFromString,
  startDrag,
  endDrag,
} = useColorState('#6366F1');

// colorValue.hex, colorValue.oklch, … are all live`;

export const HookDemoCard = () => {
  const { hsva, colorValue, updateColor, startDrag, endDrag } =
    useColorState('#6366F1');
  return (
    <DemoCard code={useColorStateCode}>
      <div className="w-full max-w-xs space-y-3">
        <ColorArea
          hsva={hsva}
          onChange={updateColor}
          onStart={startDrag}
          onEnd={endDrag}
          height={140}
        />
        <HueSlider hsva={hsva} onChange={updateColor} />
        <div className="flex items-center gap-3">
          <ColorPreview colorValue={colorValue} />
          <code className="text-sm">{colorValue.hex}</code>
        </div>
      </div>
    </DemoCard>
  );
};
