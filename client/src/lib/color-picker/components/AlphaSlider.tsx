import type { CSSProperties, KeyboardEvent } from 'react';
import { useCallback, useRef } from 'react';
import { usePointerDrag } from '../hooks';
import type { HSVA } from '../types';
import { hsvToRgb } from '../conversions';
import { getSliderKeyValue } from './slider-keys';

export interface AlphaSliderProps {
  hsva: HSVA;
  onChange: (hsva: HSVA) => void;
  onStart?: () => void;
  onEnd?: () => void;
  vertical?: boolean;
  className?: string;
}

export function AlphaSlider({
  hsva,
  onChange,
  onStart,
  onEnd,
  vertical = false,
  className = '',
}: AlphaSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (position: { x: number; y: number }) => {
      const alpha = vertical ? 1 - position.y : position.x;
      onChange({
        ...hsva,
        a: Math.round(alpha * 100) / 100,
      });
    },
    [hsva, onChange, vertical]
  );

  const { handlePointerDown } = usePointerDrag(
    handleMove,
    onStart,
    onEnd,
    containerRef
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 0.1 : 0.01;
      const newA = getSliderKeyValue(e.key, hsva.a, step, 0, 1);
      if (newA === null) return;
      e.preventDefault();
      onChange({ ...hsva, a: Math.round(newA * 100) / 100 });
    },
    [hsva, onChange]
  );

  const rgb = hsvToRgb(hsva);
  const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  const gradient = `linear-gradient(to ${vertical ? 'top' : 'right'}, rgba(${rgbString}, 0), rgba(${rgbString}, 1))`;

  const alphaPercentage = Math.round(hsva.a * 100);

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Alpha (transparency)"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={alphaPercentage}
      aria-valuetext={`${alphaPercentage}%`}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      tabIndex={0}
      className={`ck-alpha-slider${vertical ? ' ck-alpha-slider--vertical' : ''} ${className}`.trim()}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      data-testid="alpha-slider"
    >
      <div className="ck-alpha-slider-track ck-checkerboard" />
      <div className="ck-alpha-slider-track" style={{ background: gradient }} />
      <div
        className="ck-slider-thumb"
        style={
          vertical
            ? ({ '--ck-y': 1 - hsva.a } as CSSProperties)
            : ({ '--ck-x': hsva.a } as CSSProperties)
        }
        data-testid="alpha-slider-thumb"
      >
        <div className="ck-slider-thumb-inner" />
      </div>
    </div>
  );
}
