// ============================================================
// RECENT COLORS COMPONENT
// ============================================================
// Displays a grid of recently used colors with click-to-select

import { useColorHistory } from './picker-state';

export interface RecentColorsProps {
  onColorSelect: (color: string) => void;
  className?: string;
  /**
   * Colors to display. When provided (e.g. by `ColorPicker`), this is the
   * single source of truth and updates live. When omitted, the component reads
   * the persisted history from localStorage once on mount.
   */
  colors?: string[];
}

export function RecentColors({
  onColorSelect,
  className = '',
  colors,
}: RecentColorsProps) {
  // useSyncExternalStore gives server rendering a stable empty snapshot while
  // preserving persisted history after hydration.
  const { history: fallbackColors } = useColorHistory(colors === undefined, 10);
  const recentColors = colors ?? fallbackColors;

  if (recentColors.length === 0) {
    return null;
  }

  return (
    <div className={`ck-recent-colors ${className}`}>
      <div className="ck-recent-colors-label">Recent colors</div>
      <div className="ck-recent-colors-grid">
        {recentColors.map((color) => (
          <button
            key={color}
            className="ck-recent-color-swatch"
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
