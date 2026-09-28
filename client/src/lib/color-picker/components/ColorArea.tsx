import type { CSSProperties, KeyboardEvent } from 'react';
import { useCallback, useRef } from 'react';
import { usePointerDrag } from '../hooks';
import type { HSVA } from '../types';
import { getSliderKeyValue } from './slider-keys';

export interface ColorAreaProps {
  hsva: HSVA;
  onChange: (hsva: HSVA) => void;
  onStart?: () => void;
  onEnd?: () => void;
  width?: number;
  height?: number;
  className?: string;
}

export function ColorArea({
  hsva,
  onChange,
  onStart,
  onEnd,
  width,
  height,
  className = '',
}: ColorAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (position: { x: number; y: number }) => {
      onChange({
        ...hsva,
        s: Math.round(position.x * 100),
        v: Math.round((1 - position.y) * 100),
      });
    },
    [hsva, onChange]
  );

  const { handlePointerDown } = usePointerDrag(
    handleMove,
    onStart,
    onEnd,
    containerRef
  );

  const handleAxisKeyDown = useCallback(
    (axis: 's' | 'v', e: KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 10 : 1;
      const nextValue = getSliderKeyValue(e.key, hsva[axis], step, 0, 100, 10);
      if (nextValue === null) return;
      e.preventDefault();
      onChange({ ...hsva, [axis]: nextValue });
    },
    [hsva, onChange]
  );

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Saturation and brightness color area"
      className={`ck-color-area ${className}`.trim()}
      style={{ width, height }}
      onPointerDown={handlePointerDown}
      data-testid="color-area"
    >
      <div
        className="ck-color-area-layer"
        style={{ backgroundColor: `hsl(${hsva.h}, 100%, 50%)` }}
      />
      <div className="ck-color-area-layer ck-color-area-layer--saturation" />
      <div className="ck-color-area-layer ck-color-area-layer--brightness" />
      <div
        className="ck-color-area-axis ck-color-area-axis--saturation"
        role="slider"
        tabIndex={0}
        aria-label="Saturation"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={hsva.s}
        aria-valuetext={`${hsva.s}% saturation`}
        onKeyDown={(event) => handleAxisKeyDown('s', event)}
        data-testid="saturation-slider"
      />
      <div
        className="ck-color-area-axis ck-color-area-axis--brightness"
        role="slider"
        tabIndex={0}
        aria-label="Brightness"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={hsva.v}
        aria-valuetext={`${hsva.v}% brightness`}
        onKeyDown={(event) => handleAxisKeyDown('v', event)}
        data-testid="brightness-slider"
      />
      <div className="ck-color-area-axis-status" aria-hidden="true">
        <span className="ck-color-area-status-saturation">
          Saturation {hsva.s}%
        </span>
        <span className="ck-color-area-status-brightness">
          Brightness {hsva.v}%
        </span>
      </div>
      <div
        className="ck-color-area-thumb"
        style={
          {
            '--ck-x': hsva.s / 100,
            '--ck-y': 1 - hsva.v / 100,
          } as CSSProperties
        }
        data-testid="color-area-thumb"
      >
        <div className="ck-color-area-thumb-inner" />
      </div>
    </div>
  );
}
