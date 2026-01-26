import { useCallback, useMemo, useRef, KeyboardEvent } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  const { handlePointerDown } = usePointerDrag(
    handleMove,
    onStart,
    onEnd,
    containerRef
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 10 : 1;
      let newH = hsva.h;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          newH = (hsva.h - step + 360) % 360;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          newH = (hsva.h + step) % 360;
          break;
        case 'Home':
          e.preventDefault();
          newH = 0;
          break;
        case 'End':
          e.preventDefault();
          newH = 359;
          break;
        default:
          return;
      }

      onChange({ ...hsva, h: newH });
    },
    [hsva, onChange]
  );

  const thumbPosition = useMemo(() => `${(hsva.h / 360) * 100}%`, [hsva.h]);

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={hsva.h}
      aria-valuetext={`${hsva.h}°`}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      tabIndex={0}
      className={`ck-hue-slider${vertical ? ' ck-hue-slider--vertical' : ''} ${className}`}
      style={vertical ? { width: '16px', height: '100%' } : undefined}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      data-testid="hue-slider"
    >
      <div
        className="ck-hue-slider-track"
        style={
          vertical
            ? {
                background:
                  'linear-gradient(to bottom, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
              }
            : undefined
        }
      />
      <div
        className="ck-slider-thumb"
        style={
          vertical
            ? { top: thumbPosition, left: '50%' }
            : { left: thumbPosition }
        }
        data-testid="hue-slider-thumb"
      >
        <div className="ck-slider-thumb-inner" />
      </div>
    </div>
  );
}
