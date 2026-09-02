import type { KeyboardEvent } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { usePointerDrag } from '../hooks';
import type { HSVA } from '../types';

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
  width = 256,
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
      let nextValue = hsva[axis];

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          nextValue = Math.max(0, nextValue - step);
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          nextValue = Math.min(100, nextValue + step);
          break;
        case 'Home':
          e.preventDefault();
          nextValue = 0;
          break;
        case 'End':
          e.preventDefault();
          nextValue = 100;
          break;
        case 'PageUp':
          e.preventDefault();
          nextValue = Math.min(100, nextValue + 10);
          break;
        case 'PageDown':
          e.preventDefault();
          nextValue = Math.max(0, nextValue - 10);
          break;
        default:
          return;
      }

      onChange({ ...hsva, [axis]: nextValue });
    },
    [hsva, onChange]
  );

  const thumbStyle = useMemo(
    () => ({
      left: `${hsva.s}%`,
      top: `${100 - hsva.v}%`,
    }),
    [hsva.s, hsva.v]
  );

  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: `hsl(${hsva.h}, 100%, 50%)`,
    }),
    [hsva.h]
  );

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Saturation and brightness color area"
      className={`ck-color-area ${className}`}
      style={height != null ? { width, height } : { width }}
      onPointerDown={handlePointerDown}
      data-testid="color-area"
    >
      <div className="ck-color-area-layer" style={backgroundStyle} />
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
        style={thumbStyle}
        data-testid="color-area-thumb"
      >
        <div className="ck-color-area-thumb-inner" />
      </div>
    </div>
  );
}
