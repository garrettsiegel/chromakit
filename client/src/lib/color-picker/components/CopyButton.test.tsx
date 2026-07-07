import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('copies the given text to the clipboard on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyButton text="#ff0000" />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(writeText).toHaveBeenCalledWith('#ff0000');
  });

  it('shows a copied indicator after a successful copy, then resets after 2s', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyButton text="#ff0000" label="Copy" />);
    const button = screen.getByRole('button');

    expect(button).toHaveAccessibleName('Copy');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveAccessibleName('Copied!');

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(button).toHaveAccessibleName('Copy');
  });

  it('calls onCopy with the success result', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = vi.fn();

    render(<CopyButton text="#ff0000" onCopy={onCopy} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(onCopy).toHaveBeenCalledWith(true);
  });

  it('does not crash and reports failure when the clipboard write rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = vi.fn();

    render(<CopyButton text="#ff0000" onCopy={onCopy} />);
    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(onCopy).toHaveBeenCalledWith(false);
    expect(button).toHaveAccessibleName('Copy');
  });
});
