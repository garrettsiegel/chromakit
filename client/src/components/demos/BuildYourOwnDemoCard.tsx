import { DemoCard } from '@/components/docs/DemoCard';
import { CustomPickerDemo } from '@/components/demo/CustomPickerDemo';

const buildYourOwnCode = `import {
  ColorArea,
  HueSlider,
  AlphaSlider,
  ColorPreview,
  useColorState,
} from 'chromakit-react';

function CustomPicker() {
  const { hsva, colorValue, updateColor, startDrag, endDrag } =
    useColorState('#6366F1');

  return (
    <div className="space-y-4">
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
}`;

export const BuildYourOwnDemoCard = () => (
  <DemoCard code={buildYourOwnCode}>
    <div className="w-full max-w-sm">
      <CustomPickerDemo />
    </div>
  </DemoCard>
);
