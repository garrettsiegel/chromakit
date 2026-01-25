import { useCallback, useMemo } from 'react';
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

  const { containerRef, handlePointerDown } = usePointerDrag(
    handleMove,
    onStart,
    onEnd
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
      className={`relative rounded-md cursor-crosshair select-none touch-none ${className}`}
      style={{ width, height }}
      onPointerDown={handlePointerDown}
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
