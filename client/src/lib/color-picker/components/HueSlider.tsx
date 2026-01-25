import { useCallback, useMemo } from 'react';
import { usePointerDrag } from '../hooks';
import type { HSVA } from '../types';

interface HueSliderProps {
  hsva: HSVA;
  onChange: (hsva: HSVA) => void;
  onStart?: () => void;
  onEnd?: () => void;
  vertical?: boolean;
  className?: string;
}

export function HueSlider({
  hsva,
  onChange,
  onStart,
  onEnd,
  vertical = false,
  className = '',
}: HueSliderProps) {
  const handleMove = useCallback(
    (position: { x: number; y: number }) => {
      const hue = vertical ? position.y * 360 : position.x * 360;
      onChange({
        ...hsva,
        h: Math.round(hue),
      });
    },
    [hsva, onChange, vertical]
  );

  const { containerRef, handlePointerDown } = usePointerDrag(
    handleMove,
    onStart,
    onEnd
  );

  const thumbPosition = useMemo(
    () => `${(hsva.h / 360) * 100}%`,
    [hsva.h]
  );

  return (
    <div
      ref={containerRef}
      className={`relative cursor-pointer select-none touch-none ${
        vertical ? 'w-4 h-full' : 'h-4 w-full'
      } ${className}`}
      onPointerDown={handlePointerDown}
      data-testid="hue-slider"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: vertical
            ? 'linear-gradient(to bottom, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
            : 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        }}
      />
      <div
        className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
          vertical ? 'left-1/2' : 'top-1/2'
        }`}
        style={vertical ? { top: thumbPosition } : { left: thumbPosition }}
      >
        <div className="w-full h-full rounded-full bg-white border-2 border-white shadow-md ring-1 ring-black/20" />
      </div>
    </div>
  );
}
