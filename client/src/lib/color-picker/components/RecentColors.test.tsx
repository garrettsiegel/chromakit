import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecentColors } from './RecentColors';
import { addToColorHistory, clearColorHistory } from '../utils';

describe('RecentColors', () => {
  beforeEach(() => {
    clearColorHistory();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearColorHistory();
  });

  it('renders swatches from the colors prop', () => {
    render(
      <RecentColors colors={['#ff0000', '#00ff00']} onColorSelect={vi.fn()} />
    );

    expect(screen.getByLabelText('Select color #ff0000')).toBeInTheDocument();
    expect(screen.getByLabelText('Select color #00ff00')).toBeInTheDocument();
  });

  it('calls onColorSelect with the clicked color', () => {
    const onColorSelect = vi.fn();
    render(<RecentColors colors={['#ff0000']} onColorSelect={onColorSelect} />);

    fireEvent.click(screen.getByLabelText('Select color #ff0000'));

    expect(onColorSelect).toHaveBeenCalledWith('#ff0000');
  });

  it('renders nothing when there are no colors', () => {
    const { container } = render(
      <RecentColors colors={[]} onColorSelect={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('reflects live updates to the colors prop (regression: stale snapshot)', () => {
    const { rerender } = render(
      <RecentColors colors={['#ff0000']} onColorSelect={vi.fn()} />
    );

    expect(screen.queryByLabelText('Select color #0000ff')).toBeNull();

    rerender(
      <RecentColors colors={['#0000ff', '#ff0000']} onColorSelect={vi.fn()} />
    );

    // The newly added color appears without remounting the component.
    expect(screen.getByLabelText('Select color #0000ff')).toBeInTheDocument();
  });

  it('falls back to persisted history when no colors prop is given', () => {
    addToColorHistory('#123456');

    render(<RecentColors onColorSelect={vi.fn()} />);

    expect(screen.getByLabelText('Select color #123456')).toBeInTheDocument();
  });
});
