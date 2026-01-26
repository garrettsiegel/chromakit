// ============================================================
// COLOR COMPARISON COMPONENT
// ============================================================
// Shows previous and current color side-by-side

export interface ColorComparisonProps {
  previousColor: string;
  currentColor: string;
  className?: string;
}

export function ColorComparison({
  previousColor,
  currentColor,
  className = '',
}: ColorComparisonProps) {
  return (
    <div className={`ck-color-comparison ${className}`}>
      <button
        className="ck-comparison-swatch"
        style={{ backgroundColor: previousColor }}
        title={`Previous: ${previousColor}`}
        aria-label={`Previous color: ${previousColor}`}
      >
        <span className="ck-comparison-label">Prev</span>
      </button>
      <button
        className="ck-comparison-swatch"
        style={{ backgroundColor: currentColor }}
        title={`Current: ${currentColor}`}
        aria-label={`Current color: ${currentColor}`}
      >
        <span className="ck-comparison-label">Curr</span>
      </button>
    </div>
  );
}
