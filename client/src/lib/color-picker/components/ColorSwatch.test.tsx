import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorSwatch } from './ColorSwatch';

describe('ColorSwatch long-press', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('fires onLongPress once after 500ms and swallows the trailing click', () => {
    const onClick = vi.fn();
    const onLongPress = vi.fn();

    render(
      <ColorSwatch
        color="#ff0000"
        onClick={onClick}
        onLongPress={onLongPress}
      />
    );
    const button = screen.getByTestId('color-swatch');

    fireEvent.pointerDown(button);
    vi.advanceTimersByTime(500);
    fireEvent.pointerUp(button);
    fireEvent.click(button);

    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('fires onClick for a quick tap and never fires onLongPress', () => {
    const onClick = vi.fn();
    const onLongPress = vi.fn();

    render(
      <ColorSwatch
        color="#ff0000"
        onClick={onClick}
        onLongPress={onLongPress}
      />
    );
    const button = screen.getByTestId('color-swatch');

    fireEvent.pointerDown(button);
    vi.advanceTimersByTime(100);
    fireEvent.pointerUp(button);
    fireEvent.click(button);
    vi.advanceTimersByTime(500);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onLongPress).not.toHaveBeenCalled();
  });
});
