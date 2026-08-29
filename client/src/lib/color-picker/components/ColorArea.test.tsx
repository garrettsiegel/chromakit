import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { HSVA } from '../types';
import { ColorArea } from './ColorArea';

describe('ColorArea', () => {
  const defaultHsva: HSVA = { h: 200, s: 50, v: 80, a: 1 };
  const onChange = vi.fn();
  const onStart = vi.fn();
  const onEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the visual plane and positions the pointer', () => {
    render(<ColorArea hsva={defaultHsva} onChange={onChange} />);

    expect(screen.getByTestId('color-area')).toBeInTheDocument();
    expect(screen.getByTestId('color-area-thumb')).toHaveStyle({
      left: '50%',
      top: '20%',
    });
  });

  it('applies dimensions and custom classes without an implicit height', () => {
    const { rerender } = render(
      <ColorArea
        hsva={defaultHsva}
        onChange={onChange}
        className="custom-class"
        width={300}
        height={250}
      />
    );
    const area = screen.getByTestId('color-area');

    expect(area).toHaveClass('ck-color-area', 'custom-class');
    expect(area).toHaveStyle({ width: '300px', height: '250px' });

    rerender(<ColorArea hsva={defaultHsva} onChange={onChange} />);
    expect(area.style.height).toBe('');
  });

  it('updates the hue layer', () => {
    const { rerender } = render(
      <ColorArea hsva={defaultHsva} onChange={onChange} />
    );
    const layer = screen
      .getByTestId('color-area')
      .querySelector('.ck-color-area-layer');

    expect(layer).toHaveStyle({ backgroundColor: 'hsl(200, 100%, 50%)' });
    rerender(
      <ColorArea hsva={{ ...defaultHsva, h: 120 }} onChange={onChange} />
    );
    expect(layer).toHaveStyle({ backgroundColor: 'hsl(120, 100%, 50%)' });
  });

  describe('semantics', () => {
    it('exposes a labeled group with independent axis sliders', () => {
      render(<ColorArea hsva={defaultHsva} onChange={onChange} />);

      expect(
        screen.getByRole('group', {
          name: 'Saturation and brightness color area',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('slider', { name: 'Saturation' })
      ).toHaveAttribute('aria-valuetext', '50% saturation');
      expect(
        screen.getByRole('slider', { name: 'Brightness' })
      ).toHaveAttribute('aria-valuetext', '80% brightness');
    });

    it('keeps both controls keyboard focusable and oriented', () => {
      render(<ColorArea hsva={defaultHsva} onChange={onChange} />);
      const saturation = screen.getByTestId('saturation-slider');
      const brightness = screen.getByTestId('brightness-slider');

      expect(saturation).toHaveAttribute('tabIndex', '0');
      expect(saturation).toHaveAttribute('aria-orientation', 'horizontal');
      expect(brightness).toHaveAttribute('tabIndex', '0');
      expect(brightness).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('keyboard input', () => {
    it('changes saturation with arrow keys', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={onChange} />);
      screen.getByTestId('saturation-slider').focus();

      await user.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenLastCalledWith({ ...defaultHsva, s: 51 });

      await user.keyboard('{ArrowLeft}');
      expect(onChange).toHaveBeenLastCalledWith({ ...defaultHsva, s: 49 });
    });

    it('changes brightness with arrow keys', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={onChange} />);
      screen.getByTestId('brightness-slider').focus();

      await user.keyboard('{ArrowUp}');
      expect(onChange).toHaveBeenLastCalledWith({ ...defaultHsva, v: 81 });

      await user.keyboard('{ArrowDown}');
      expect(onChange).toHaveBeenLastCalledWith({ ...defaultHsva, v: 79 });
    });

    it('supports large steps, bounds, Home, and End on either axis', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={onChange} />);
      const saturation = screen.getByTestId('saturation-slider');
      saturation.focus();

      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
      expect(onChange).toHaveBeenLastCalledWith({ ...defaultHsva, s: 60 });
      await user.keyboard('{Home}');
      expect(onChange).toHaveBeenLastCalledWith({ ...defaultHsva, s: 0 });
      await user.keyboard('{End}');
      expect(onChange).toHaveBeenLastCalledWith({ ...defaultHsva, s: 100 });
    });

    it('supports page steps and clamps brightness', async () => {
      const user = userEvent.setup();
      const highValue = { ...defaultHsva, v: 95 };
      render(<ColorArea hsva={highValue} onChange={onChange} />);
      screen.getByTestId('brightness-slider').focus();

      await user.keyboard('{PageUp}');
      expect(onChange).toHaveBeenLastCalledWith({ ...highValue, v: 100 });
      await user.keyboard('{PageDown}');
      expect(onChange).toHaveBeenLastCalledWith({ ...highValue, v: 85 });
    });

    it('ignores unrelated keys', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={onChange} />);
      screen.getByTestId('saturation-slider').focus();

      await user.keyboard('a');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('pointer input', () => {
    it('starts, moves, and completes a drag on the visual plane', () => {
      render(
        <ColorArea
          hsva={defaultHsva}
          onChange={onChange}
          onStart={onStart}
          onEnd={onEnd}
          width={256}
          height={200}
        />
      );
      const area = screen.getByTestId('color-area');
      area.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 256,
        bottom: 200,
        width: 256,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));

      fireEvent.pointerDown(area, { clientX: 128, clientY: 100 });
      fireEvent.pointerMove(document, { clientX: 128, clientY: 100 });
      fireEvent.pointerUp(document);

      expect(onStart).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith({ ...defaultHsva, s: 50, v: 50 });
      expect(onEnd).toHaveBeenCalledOnce();
    });
  });

  it('handles extreme axis values', () => {
    render(
      <ColorArea hsva={{ h: 360, s: 100, v: 0, a: 1 }} onChange={onChange} />
    );

    expect(screen.getByTestId('color-area-thumb')).toHaveStyle({
      left: '100%',
      top: '100%',
    });
  });
});
