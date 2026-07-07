import {
  ColorArea,
  HueSlider,
  ColorPreview,
  useColorState,
} from '@/lib/color-picker';
import { DocSection } from '@/components/docs/DocSection';
import { DemoCard } from '@/components/docs/DemoCard';
import { CodeBlock } from '@/components/demo/CodeBlock';
import { PropsTable } from '@/components/docs/PropsTable';
import type { PropRow } from '@/components/docs/PropsTable';

const useColorStateReturn: PropRow[] = [
  { name: 'hsva', type: 'HSVA', description: 'Internal HSVA representation.' },
  {
    name: 'colorValue',
    type: 'ColorValue',
    description: 'The color in every format.',
  },
  {
    name: 'updateColor',
    type: '(hsva: HSVA) => void',
    description: 'Set the color from an HSVA value (used by sliders/area).',
  },
  {
    name: 'setFromString',
    type: '(color: string) => ColorValue | null',
    description: 'Parse and set from any color string.',
  },
  {
    name: 'startDrag',
    type: '() => void',
    description: 'Mark a drag as begun (gates onChangeComplete).',
  },
  {
    name: 'endDrag',
    type: '() => void',
    description: 'End a drag; fires onChangeComplete with the final color.',
  },
  {
    name: 'isDragging',
    type: 'RefObject<boolean>',
    description: 'Whether a drag is currently in progress.',
  },
];

const useColorStateCode = `const {
  hsva,
  colorValue,
  updateColor,
  setFromString,
  startDrag,
  endDrag,
} = useColorState('#6366F1');

// colorValue.hex, colorValue.oklch, … are all live`;

const usePointerDragCode = `const { containerRef, handlePointerDown } = usePointerDrag(
  ({ x, y }) => {
    // x, y are 0..1 within the element
  },
  onStart,
  onEnd,
);

<div ref={containerRef} onPointerDown={handlePointerDown} />`;

const useDebounceCode = `const debounced = useDebounce(color, 200);

useEffect(() => {
  save(debounced); // runs 200ms after the last change
}, [debounced]);`;

const HookDemo = () => {
  const { hsva, colorValue, updateColor, startDrag, endDrag } =
    useColorState('#6366F1');
  return (
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
  );
};

export default function HooksDoc() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Hooks</h1>
        <p className="text-lg text-muted-foreground">
          Three hooks power the components. <code>useColorState</code> is the one
          you reach for most — it holds the color and hands you every setter the
          primitives need.
        </p>
      </div>

      <DocSection
        id="use-color-state"
        title="useColorState"
        description="The core state hook. Give it an initial color; it returns the current color in every format plus the setters that ColorArea, the sliders, and the inputs expect."
      >
        <CodeBlock code={useColorStateCode} language="typescript" />
        <DemoCard code={useColorStateCode}>
          <HookDemo />
        </DemoCard>
        <h3 className="text-base font-semibold">Returns</h3>
        <PropsTable
          rows={useColorStateReturn}
          labels={{ name: 'Key', type: 'Type' }}
          showDefault={false}
        />
      </DocSection>

      <DocSection
        id="use-pointer-drag"
        title="usePointerDrag"
        description="The drag primitive behind the color area and sliders. Reports normalized 0–1 coordinates and manages the document-level pointer listeners for you."
      >
        <CodeBlock code={usePointerDragCode} language="typescript" />
      </DocSection>

      <DocSection
        id="use-debounce"
        title="useDebounce"
        description="A tiny generic debounce — handy for throttling expensive work (persisting, network calls) as the color changes."
      >
        <CodeBlock code={useDebounceCode} language="typescript" />
      </DocSection>
    </>
  );
}
