import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

export const ThemedDemoCard = () => (
  <DemoCard label="Default vs .brand-picker">
    <div className="demo-compare">
      <figure>
        <ColorPicker defaultValue="#6366F1" />
        <figcaption>Default</figcaption>
      </figure>
      <figure>
        <ColorPicker defaultValue="#ec4899" className="brand-picker" />
        <figcaption>
          <code>.brand-picker</code>
        </figcaption>
      </figure>
    </div>
  </DemoCard>
);
