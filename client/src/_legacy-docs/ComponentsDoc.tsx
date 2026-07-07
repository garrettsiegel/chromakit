import { DocSection } from '@/components/docs/DocSection';
import { DemoCard } from '@/components/docs/DemoCard';
import { PropsTable } from '@/components/docs/PropsTable';
import { CustomPickerDemo } from '@/components/demo/CustomPickerDemo';
import { componentGroups } from '@/site-data/components-data';

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

export default function ComponentsDoc() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Composable Components
        </h1>
        <p className="text-lg text-muted-foreground">
          Prefer full control over layout? Drop the wrapper and assemble the
          primitives yourself. They all share one state object from{' '}
          <code>useColorState</code>, so wiring them together is trivial.
        </p>
      </div>

      <DocSection
        id="build-your-own"
        title="Build your own picker"
        description="The color area, sliders, inputs, and preview below are all separate exports composed by hand around a single useColorState hook."
      >
        <DemoCard code={buildYourOwnCode}>
          <div className="w-full max-w-sm">
            <CustomPickerDemo />
          </div>
        </DemoCard>
      </DocSection>

      {componentGroups.map((group) => (
        <DocSection
          key={group.id}
          id={group.id}
          title={group.title}
          description={group.description}
        >
          <div className="space-y-8">
            {group.components.map((component) => (
              <div key={component.name} className="space-y-3">
                <div className="space-y-1">
                  <h3 className="font-mono text-base font-semibold text-primary">
                    {component.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </div>
                <PropsTable rows={component.props} showDefault={false} />
              </div>
            ))}
          </div>
        </DocSection>
      ))}
    </>
  );
}
