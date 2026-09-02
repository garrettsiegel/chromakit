import { useRef } from 'react';

interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  editing?: boolean;
  className?: string;
}

export function ColorSwatch({
  color,
  selected = false,
  onClick,
  onLongPress,
  onDelete,
  editing = false,
  className = '',
}: ColorSwatchProps) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const clearTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handlePointerDown = () => {
    longPressFired.current = false;
    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        longPressFired.current = true;
        onLongPress();
      }, 500);
    }
  };

  const handleClick = () => {
    clearTimer();
    // A long press already did its action; the trailing click must not also
    // select the swatch.
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    onClick?.();
  };

  return (
    <div className="ck-swatch-wrapper">
      <button
        type="button"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={clearTimer}
        onPointerLeave={clearTimer}
        onPointerCancel={clearTimer}
        className={`ck-swatch-btn ${selected ? 'selected' : ''} ${editing ? 'ck-swatch-editing' : ''} ${className}`}
        data-testid="color-swatch"
        title={
          editing
            ? 'Click to update color'
            : onLongPress
              ? 'Click to select, hold to update with current color'
              : color
        }
      >
        <div className="ck-swatch-color" style={{ backgroundColor: color }} />
      </button>
      {editing && onDelete && (
        <button
          type="button"
          className="ck-swatch-delete-btn"
          onClick={onDelete}
          title="Delete preset"
          aria-label="Delete preset"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}
