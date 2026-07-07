import { ColorPicker } from '@/lib/color-picker';
import { DemoCard } from '@/components/docs/DemoCard';

const overrideCode = `/* your stylesheet */
.brand-picker {
  --ck-primary: #ec4899;
  --ck-accent: #f43f5e;
  --ck-primary-glow: rgba(236, 72, 153, 0.4);
  --ck-radius: 4px;
  --ck-radius-md: 3px;
  --ck-radius-sm: 2px;
}`;

const applyCode = `<ColorPicker className="brand-picker" />`;

export const themedDemoCode = `${overrideCode}\n\n${applyCode}`;

export const ThemedDemoCard = () => (
  <DemoCard code={themedDemoCode} language="css">
    <div className="flex flex-wrap items-start justify-center gap-8">
      <div className="space-y-2 text-center">
        <ColorPicker defaultValue="#6366F1" />
        <p className="text-xs text-muted-foreground">Default</p>
      </div>
      <div className="space-y-2 text-center">
        <ColorPicker defaultValue="#ec4899" className="ck-demo-theme" />
        <p className="text-xs text-muted-foreground">
          <code>.ck-demo-theme</code>
        </p>
      </div>
    </div>
  </DemoCard>
);
