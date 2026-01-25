import { useCallback, useMemo } from 'react';
import { usePointerDrag } from '../hooks';
import type { HSVA } from '../types';
import { hsvToRgb } from '../conversions';

interface AlphaSliderProps {
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

  const { containerRef, handlePointerDown } = usePointerDrag(
    handleMove,
    onStart,
    onEnd
  );

  const rgb = useMemo(() => hsvToRgb(hsva), [hsva]);

  const gradientStyle = useMemo(() => {
    const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    return {
      background: vertical
        ? `linear-gradient(to top, rgba(${rgbString}, 0), rgba(${rgbString}, 1))`
        : `linear-gradient(to right, rgba(${rgbString}, 0), rgba(${rgbString}, 1))`,
    };
  }, [rgb, vertical]);

  const thumbPosition = useMemo(
    () => `${hsva.a * 100}%`,
    [hsva.a]
  );

  return (
    <div
      ref={containerRef}
      className={`relative cursor-pointer select-none touch-none ${
        vertical ? 'w-4 h-full' : 'h-4 w-full'
      } ${className}`}
      onPointerDown={handlePointerDown}
      data-testid="alpha-slider"
    >
      <div className="absolute inset-0 rounded-full color-picker-checkerboard" />
      <div
        className="absolute inset-0 rounded-full"
        style={gradientStyle}
      />
      <div
        className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
          vertical ? 'left-1/2' : 'top-1/2'
        }`}
        style={
          vertical
            ? { top: `${100 - hsva.a * 100}%` }
            : { left: thumbPosition }
        }
      >
        <div className="w-full h-full rounded-full bg-white border-2 border-white shadow-md ring-1 ring-black/20" />
      </div>
    </div>
  );
}
