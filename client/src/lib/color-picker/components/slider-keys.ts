/**
 * Next value for a slider navigation key, or null when the key is not handled.
 * PageUp/PageDown are handled only when `pageStep` is given.
 */
export function getSliderKeyValue(
  key: string,
  value: number,
  step: number,
  min: number,
  max: number,
  pageStep?: number
): number | null {
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return Math.max(min, value - step);
    case 'ArrowRight':
    case 'ArrowUp':
      return Math.min(max, value + step);
    case 'Home':
      return min;
    case 'End':
      return max;
    case 'PageUp':
      return pageStep === undefined ? null : Math.min(max, value + pageStep);
    case 'PageDown':
      return pageStep === undefined ? null : Math.max(min, value - pageStep);
    default:
      return null;
  }
}
