import { useCallback, useMemo, useRef, KeyboardEvent } from 'react';
import { usePointerDrag } from '../hooks';
import type { HSVA } from '../types';

interface ColorAreaProps {
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
  height = 200,
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 10 : 1;
      let newS = hsva.s;
      let newV = hsva.v;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newS = Math.max(0, hsva.s - step);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newS = Math.min(100, hsva.s + step);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newV = Math.min(100, hsva.v + step);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newV = Math.max(0, hsva.v - step);
          break;
        default:
          return;
      }

      onChange({ ...hsva, s: newS, v: newV });
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
      role="slider"
      aria-label="Color saturation and value"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={hsva.s}
      aria-valuetext={`Saturation ${hsva.s}%, Value ${hsva.v}%`}
      tabIndex={0}
      className={`relative rounded-md cursor-crosshair select-none touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      style={{ width, height }}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      data-testid="color-area"
    >
      <div
        className="absolute inset-0 rounded-md"
        style={backgroundStyle}
      />
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: 'linear-gradient(to right, white, transparent)',
        }}
      />
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: 'linear-gradient(to top, black, transparent)',
        }}
      />
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={thumbStyle}
      >
        <div className="w-full h-full rounded-full border-2 border-white shadow-md ring-1 ring-black/20" />
      </div>
    </div>
  );
}
