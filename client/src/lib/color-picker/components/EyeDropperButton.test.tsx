import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { EyeDropperButton } from './EyeDropperButton';
import { isEyeDropperSupported, openEyeDropper } from '../utils';

type EyeDropperResult = { sRGBHex: string };

function installEyeDropper(open: () => Promise<EyeDropperResult>): void {
  Object.defineProperty(window, 'EyeDropper', {
    configurable: true,
    writable: true,
    value: class {
      open = open;
    },
  });
}

function removeEyeDropper(): void {
  Reflect.deleteProperty(
    window as unknown as Record<string, unknown>,
    'EyeDropper'
  );
}

describe('EyeDropperButton', () => {
  afterEach(() => {
    removeEyeDropper();
  });

  it('renders nothing when the browser has no EyeDropper', () => {
    removeEyeDropper();
    const { container } = render(<EyeDropperButton onPick={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a button when the API is available', () => {
    installEyeDropper(() => Promise.resolve({ sRGBHex: '#ff0000' }));
    render(<EyeDropperButton onPick={vi.fn()} />);
    expect(screen.getByTestId('eyedropper-button')).toBeInTheDocument();
  });

  it('reports the sampled color', async () => {
    installEyeDropper(() => Promise.resolve({ sRGBHex: '#123456' }));
    const onPick = vi.fn();
    const user = userEvent.setup();

    render(<EyeDropperButton onPick={onPick} />);
    await user.click(screen.getByTestId('eyedropper-button'));

    await waitFor(() => {
      expect(onPick).toHaveBeenCalledWith('#123456');
    });
  });

  it('stays quiet when the user dismisses the sampler', async () => {
    installEyeDropper(() => Promise.reject(new Error('aborted')));
    const onPick = vi.fn();
    const user = userEvent.setup();

    render(<EyeDropperButton onPick={onPick} />);
    await user.click(screen.getByTestId('eyedropper-button'));

    await waitFor(() => {
      expect(screen.getByTestId('eyedropper-button')).not.toBeDisabled();
    });
    expect(onPick).not.toHaveBeenCalled();
  });

  it('accepts a custom label', () => {
    installEyeDropper(() => Promise.resolve({ sRGBHex: '#ff0000' }));
    render(<EyeDropperButton onPick={vi.fn()} label="Sample screen" />);
    expect(screen.getByLabelText('Sample screen')).toBeInTheDocument();
  });
});

describe('eyedropper utilities', () => {
  afterEach(() => {
    removeEyeDropper();
  });

  it('detects support', () => {
    removeEyeDropper();
    expect(isEyeDropperSupported()).toBe(false);

    installEyeDropper(() => Promise.resolve({ sRGBHex: '#ff0000' }));
    expect(isEyeDropperSupported()).toBe(true);
  });

  it('resolves null when unsupported', async () => {
    removeEyeDropper();
    await expect(openEyeDropper()).resolves.toBeNull();
  });

  it('resolves null when the sampler throws', async () => {
    installEyeDropper(() => Promise.reject(new Error('aborted')));
    await expect(openEyeDropper()).resolves.toBeNull();
  });
});
