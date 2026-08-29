import { useCallback, useState } from 'react';
import {
  ColorPicker,
  parseColor,
  rgbaToColorValue,
  type ColorValue,
  type PresetGroup,
} from '@/lib/color-picker';
import { ColorFormatsDisplay } from '@/components/shared/ColorFormatsDisplay';

const INITIAL_COLOR = '#ddfe3f';

const PRESET_GROUPS: PresetGroup[] = [
  {
    name: 'Workbench',
    colors: [
      '#DDFE3F',
      '#202516',
      '#12140E',
      '#F6F3E9',
      '#B7C0FF',
      '#FF784F',
      '#FF68C8',
    ],
  },
];

function initialColorValue(): ColorValue {
  const rgba = parseColor(INITIAL_COLOR);
  return rgba
    ? rgbaToColorValue(rgba)
    : rgbaToColorValue({ r: 221, g: 254, b: 63, a: 1 });
}

export function DemoPlayground() {
  const [color, setColor] = useState(INITIAL_COLOR);
  const [colorValue, setColorValue] = useState(initialColorValue);

  const handleColorChange = useCallback((nextColor: ColorValue) => {
    setColor(nextColor.hex8);
    setColorValue(nextColor);
  }, []);

  return (
    <section
      id="workbench"
      className="workbench-section"
      aria-labelledby="workbench-title"
    >
      <div className="container">
        <header className="workbench-heading">
          <h2 id="workbench-title">The color workbench</h2>
          <p>
            Drag, type, use arrow keys, or choose a preset. Every representation
            stays in sync from one color value.
          </p>
        </header>

        <div className="workbench-grid">
          <div className="workbench-picker">
            <h3 className="workbench-field-title">Pick</h3>
            <ColorPicker
              value={color}
              onChange={handleColorChange}
              presetGroups={PRESET_GROUPS}
              height={230}
              showEyeDropper
            />
          </div>

          <div className="workbench-ledger" aria-live="polite">
            <div
              className="workbench-sample"
              style={{ backgroundColor: colorValue.hex }}
            >
              <span>{colorValue.hex}</span>
            </div>
            <dl>
              <div>
                <dt>Lightness</dt>
                <dd>{Math.round(colorValue.oklch.L * 100)}%</dd>
              </div>
              <div>
                <dt>Chroma</dt>
                <dd>{colorValue.oklch.C.toFixed(3)}</dd>
              </div>
              <div>
                <dt>Hue</dt>
                <dd>{Math.round(colorValue.oklch.h)}°</dd>
              </div>
              <div>
                <dt>Alpha</dt>
                <dd>{Math.round(colorValue.rgba.a * 100)}%</dd>
              </div>
            </dl>
          </div>

          <div className="workbench-formats">
            <h3 className="workbench-field-title">Copy any format</h3>
            <ColorFormatsDisplay colorValue={colorValue} />
          </div>
        </div>
      </div>
    </section>
  );
}
