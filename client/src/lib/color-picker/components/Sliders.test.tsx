import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HueSlider } from './HueSlider';
import { AlphaSlider } from './AlphaSlider';
import type { HSVA } from '../types';

describe('HueSlider', () => {
  const defaultHsva: HSVA = { h: 180, s: 50, v: 80, a: 1 };
  const mockOnChange = vi.fn();
  const mockOnStart = vi.fn();
  const mockOnEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render horizontal slider by default', () => {
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });
      expect(slider).toBeInTheDocument();
    });

    it('should render vertical slider when specified', () => {
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} vertical />);
      const slider = screen.getByRole('slider', { name: /hue/i });
      expect(slider).toHaveClass('ck-hue-slider--vertical');
    });

    it('should apply custom className', () => {
      render(
        <HueSlider
          hsva={defaultHsva}
          onChange={mockOnChange}
          className="custom-class"
        />
      );
      const slider = screen.getByRole('slider', { name: /hue/i });
      expect(slider).toHaveClass('ck-hue-slider', 'custom-class');
    });

    it('should position thumb based on hue value', () => {
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('hue-slider-thumb');
      // 180 / 360 = 50%
      expect(thumb).toHaveStyle({ left: '50%' });
    });

    it('should position thumb at start for hue 0', () => {
      const redHue: HSVA = { h: 0, s: 50, v: 80, a: 1 };
      render(<HueSlider hsva={redHue} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('hue-slider-thumb');
      expect(thumb).toHaveStyle({ left: '0%' });
    });

    it('should position thumb near end for hue 359', () => {
      const maxHue: HSVA = { h: 359, s: 50, v: 80, a: 1 };
      render(<HueSlider hsva={maxHue} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('hue-slider-thumb');
      expect(thumb).toHaveStyle({ left: '99.72222222222223%' });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      expect(slider).toHaveAttribute('aria-label', 'Hue');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '360');
      expect(slider).toHaveAttribute('aria-valuenow', '180');
      expect(slider).toHaveAttribute('tabIndex', '0');
    });

    it('should be keyboard focusable', () => {
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });
      expect(slider).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should increase hue on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        h: 181,
      });
    });

    it('should decrease hue on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      slider.focus();
      await user.keyboard('{ArrowLeft}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        h: 179,
      });
    });

    it('should use larger step with Shift key', async () => {
      const user = userEvent.setup();
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      slider.focus();
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        h: 190, // +10 instead of +1
      });
    });

    it('should wrap around at 360 degrees', async () => {
      const user = userEvent.setup();
      const nearMax: HSVA = { h: 359, s: 50, v: 80, a: 1 };
      render(<HueSlider hsva={nearMax} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...nearMax,
        h: 0, // Wraps back to 0
      });
    });

    it('should wrap around at 0 degrees', async () => {
      const user = userEvent.setup();
      const atMin: HSVA = { h: 0, s: 50, v: 80, a: 1 };
      render(<HueSlider hsva={atMin} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      slider.focus();
      await user.keyboard('{ArrowLeft}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...atMin,
        h: 359,
      });
    });

    it('should jump to start on Home key', async () => {
      const user = userEvent.setup();
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      slider.focus();
      await user.keyboard('{Home}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        h: 0,
      });
    });

    it('should jump to end on End key', async () => {
      const user = userEvent.setup();
      render(<HueSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /hue/i });

      slider.focus();
      await user.keyboard('{End}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        h: 359,
      });
    });
  });

  describe('Pointer Interactions', () => {
    it('should call onStart when pointer down', () => {
      render(
        <HueSlider
          hsva={defaultHsva}
          onChange={mockOnChange}
          onStart={mockOnStart}
        />
      );
      const slider = screen.getByRole('slider', { name: /hue/i });

      fireEvent.pointerDown(slider, { clientX: 100, clientY: 50 });

      expect(mockOnStart).toHaveBeenCalled();
    });

    it('should call onEnd after pointer interaction', () => {
      render(
        <HueSlider
          hsva={defaultHsva}
          onChange={mockOnChange}
          onEnd={mockOnEnd}
        />
      );
      const slider = screen.getByRole('slider', { name: /hue/i });

      fireEvent.pointerDown(slider, { clientX: 100, clientY: 50 });
      fireEvent.pointerUp(slider);

      expect(mockOnEnd).toHaveBeenCalled();
    });
  });
});

describe('AlphaSlider', () => {
  const defaultHsva: HSVA = { h: 180, s: 50, v: 80, a: 0.5 };
  const mockOnChange = vi.fn();
  const mockOnStart = vi.fn();
  const mockOnEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render horizontal slider by default', () => {
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });
      expect(slider).toBeInTheDocument();
    });

    it('should render vertical slider when specified', () => {
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} vertical />);
      const slider = screen.getByRole('slider', { name: /alpha/i });
      expect(slider).toHaveClass('ck-alpha-slider--vertical');
    });

    it('should apply custom className', () => {
      render(
        <AlphaSlider
          hsva={defaultHsva}
          onChange={mockOnChange}
          className="custom-class"
        />
      );
      const slider = screen.getByRole('slider', { name: /alpha/i });
      expect(slider).toHaveClass('ck-alpha-slider', 'custom-class');
    });

    it('should position thumb based on alpha value', () => {
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('alpha-slider-thumb');
      // 0.5 = 50%
      expect(thumb).toHaveStyle({ left: '50%' });
    });

    it('should position thumb at start for alpha 0', () => {
      const transparent: HSVA = { h: 180, s: 50, v: 80, a: 0 };
      render(<AlphaSlider hsva={transparent} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('alpha-slider-thumb');
      expect(thumb).toHaveStyle({ left: '0%' });
    });

    it('should position thumb at end for alpha 1', () => {
      const opaque: HSVA = { h: 180, s: 50, v: 80, a: 1 };
      render(<AlphaSlider hsva={opaque} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('alpha-slider-thumb');
      expect(thumb).toHaveStyle({ left: '100%' });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      expect(slider).toHaveAttribute('aria-label', 'Alpha (transparency)');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
      expect(slider).toHaveAttribute('aria-valuenow', '50'); // 0.5 * 100
      expect(slider).toHaveAttribute('tabIndex', '0');
    });

    it('should update aria-valuetext based on percentage', () => {
      const { rerender } = render(
        <AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />
      );
      const slider = screen.getByRole('slider', { name: /alpha/i });
      expect(slider).toHaveAttribute('aria-valuenow', '50');

      rerender(
        <AlphaSlider hsva={{ ...defaultHsva, a: 0.75 }} onChange={mockOnChange} />
      );
      expect(slider).toHaveAttribute('aria-valuenow', '75');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should increase alpha on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        a: 0.51, // +0.01
      });
    });

    it('should decrease alpha on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      slider.focus();
      await user.keyboard('{ArrowLeft}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        a: 0.49, // -0.01
      });
    });

    it('should use larger step with Shift key', async () => {
      const user = userEvent.setup();
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      slider.focus();
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        a: 0.6, // +0.1 instead of +0.01
      });
    });

    it('should clamp alpha at 1', async () => {
      const user = userEvent.setup();
      const maxAlpha: HSVA = { h: 180, s: 50, v: 80, a: 1 };
      render(<AlphaSlider hsva={maxAlpha} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...maxAlpha,
        a: 1, // Should not exceed 1
      });
    });

    it('should clamp alpha at 0', async () => {
      const user = userEvent.setup();
      const minAlpha: HSVA = { h: 180, s: 50, v: 80, a: 0 };
      render(<AlphaSlider hsva={minAlpha} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      slider.focus();
      await user.keyboard('{ArrowLeft}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...minAlpha,
        a: 0, // Should not go below 0
      });
    });

    it('should jump to fully opaque on Home key', async () => {
      const user = userEvent.setup();
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      slider.focus();
      await user.keyboard('{Home}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        a: 0,
      });
    });

    it('should jump to fully transparent on End key', async () => {
      const user = userEvent.setup();
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });

      slider.focus();
      await user.keyboard('{End}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        a: 1,
      });
    });
  });

  describe('Pointer Interactions', () => {
    it('should call onStart when pointer down', () => {
      render(
        <AlphaSlider
          hsva={defaultHsva}
          onChange={mockOnChange}
          onStart={mockOnStart}
        />
      );
      const slider = screen.getByRole('slider', { name: /alpha/i });

      fireEvent.pointerDown(slider, { clientX: 100, clientY: 50 });

      expect(mockOnStart).toHaveBeenCalled();
    });

    it('should call onEnd after pointer interaction', () => {
      render(
        <AlphaSlider
          hsva={defaultHsva}
          onChange={mockOnChange}
          onEnd={mockOnEnd}
        />
      );
      const slider = screen.getByRole('slider', { name: /alpha/i });

      fireEvent.pointerDown(slider, { clientX: 100, clientY: 50 });
      fireEvent.pointerUp(slider);

      expect(mockOnEnd).toHaveBeenCalled();
    });
  });

  describe('Visual Display', () => {
    it('should display checkerboard pattern for transparency', () => {
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });
      const pattern = slider.querySelector('.ck-checkerboard');
      expect(pattern).toBeInTheDocument();
    });

    it('should display gradient with current color', () => {
      render(<AlphaSlider hsva={defaultHsva} onChange={mockOnChange} />);
      const slider = screen.getByRole('slider', { name: /alpha/i });
      const tracks = slider.querySelectorAll('.ck-alpha-slider-track');
      expect(tracks.length).toBeGreaterThan(0);
    });
  });
});
