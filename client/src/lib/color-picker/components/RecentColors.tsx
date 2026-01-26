// ============================================================
// RECENT COLORS COMPONENT
// ============================================================
// Displays a grid of recently used colors with click-to-select

import { useMemo } from 'react';
import { getColorHistory } from '../utils';

export interface RecentColorsProps {
  onColorSelect: (color: string) => void;
  className?: string;
}

export function RecentColors({
  onColorSelect,
  className = '',
}: RecentColorsProps) {
  // Get color history from localStorage
  const recentColors = useMemo(() => getColorHistory(), []);

  if (recentColors.length === 0) {
    return null;
  }

  return (
    <div className={`ck-recent-colors ${className}`}>
      <div className="ck-recent-colors-label">Recent colors</div>
      <div className="ck-recent-colors-grid">
        {recentColors.map((color, index) => (
          <button
            key={`${color}-${index}`}
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
