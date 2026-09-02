import { useState, useCallback, useSyncExternalStore } from 'react';
import { isEyeDropperSupported, openEyeDropper } from '../utils';

const subscribeToSupport = () => () => undefined;

export interface EyeDropperButtonProps {
  onPick: (color: string) => void;
  label?: string;
  className?: string;
}

/**
 * Screen color sampler, backed by the browser EyeDropper API (Chromium today).
 * Renders nothing where the API is unavailable, so consumers never show a
 * button that cannot work.
 */
export function EyeDropperButton({
  onPick,
  label = 'Pick color from screen',
  className = '',
}: EyeDropperButtonProps) {
  const [picking, setPicking] = useState(false);
  const supported = useSyncExternalStore(
    subscribeToSupport,
    isEyeDropperSupported,
    () => false
  );

  const handlePick = useCallback(async () => {
    setPicking(true);
    const color = await openEyeDropper();
    setPicking(false);
    if (color) onPick(color);
  }, [onPick]);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handlePick}
      disabled={picking}
      className={`ck-eyedropper-btn ${className}`.trim()}
      aria-label={label}
      title={label}
      data-testid="eyedropper-button"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
      </svg>
    </button>
  );
}
