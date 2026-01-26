import { useCallback } from 'react';
import { isEyeDropperSupported, pickColorFromScreen } from '../utils';

interface EyeDropperButtonProps {
  onColorPick: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

export function EyeDropperButton({ onColorPick, className = '', disabled = false }: EyeDropperButtonProps) {
  const supported = isEyeDropperSupported();

  const handleClick = useCallback(async () => {
    const color = await pickColorFromScreen();
    if (color) {
      onColorPick(color);
    }
  }, [onColorPick]);

  const isDisabled = disabled || !supported;
  const title = !supported 
    ? 'Eyedropper not supported in this browser' 
    : 'Pick color from screen (⌘E / Ctrl+E)';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`ck-eyedropper-btn ${className} ${!supported ? 'ck-unsupported' : ''}`}
      aria-label={title}
      title={title}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z" />
      </svg>
    </button>
  );
}
