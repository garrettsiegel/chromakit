import { useCallback, useMemo, useRef, KeyboardEvent } from 'react';
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
      let newA = hsva.a;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          newA = Math.max(0, hsva.a - step);
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          newA = Math.min(1, hsva.a + step);
          break;
        case 'Home':
          e.preventDefault();
          newA = 0;
          break;
        case 'End':
          e.preventDefault();
          newA = 1;
          break;
        default:
          return;
      }

      onChange({ ...hsva, a: Math.round(newA * 100) / 100 });
    },
    [hsva, onChange]
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
      className={`ck-alpha-slider ${className}`}
      style={vertical ? { width: '16px', height: '100%' } : undefined}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      data-testid="alpha-slider"
    >
      <div className="ck-alpha-slider-track ck-checkerboard" />
      <div
        className="ck-alpha-slider-track"
        style={gradientStyle}
      />
      <div
        className="ck-slider-thumb"
        style={
          vertical
            ? { top: `${100 - hsva.a * 100}%`, left: '50%' }
            : { left: thumbPosition }
        }
      >
        <div className="ck-slider-thumb-inner" />
      </div>
    </div>
  );
}
