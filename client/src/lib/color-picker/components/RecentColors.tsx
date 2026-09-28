import { MAX_HISTORY_SIZE } from '../constants';
import { useColorHistory } from './picker-state';

export interface RecentColorsProps {
  onColorSelect: (color: string) => void;
  className?: string;
  /**
   * Colors to display. When provided (e.g. by `ColorPicker`), this is the
   * single source of truth. When omitted, the component shows the persisted
   * history from localStorage and updates live as it changes.
   */
  colors?: string[];
}

export function RecentColors({
  onColorSelect,
  className = '',
  colors,
}: RecentColorsProps) {
  const { history: fallbackColors } = useColorHistory(
    colors === undefined,
    MAX_HISTORY_SIZE
  );
  const recentColors = colors ?? fallbackColors;

  if (recentColors.length === 0) {
    return null;
  }

  return (
    <div className={`ck-recent-colors ${className}`.trim()}>
      <div className="ck-recent-colors-label">Recent colors</div>
      <div className="ck-recent-colors-grid">
        {recentColors.map((color) => (
          <button
            key={color}
            type="button"
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
