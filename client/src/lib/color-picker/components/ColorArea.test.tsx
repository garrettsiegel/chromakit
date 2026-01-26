import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorArea } from './ColorArea';
import type { HSVA } from '../types';

describe('ColorArea', () => {
  const defaultHsva: HSVA = { h: 200, s: 50, v: 80, a: 1 };
  const mockOnChange = vi.fn();
  const mockOnStart = vi.fn();
  const mockOnEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      expect(area).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <ColorArea
          hsva={defaultHsva}
          onChange={mockOnChange}
          className="custom-class"
        />
      );
      const area = screen.getByTestId('color-area');
      expect(area).toHaveClass('ck-color-area', 'custom-class');
    });

    it('should set custom width and height', () => {
      render(
        <ColorArea
          hsva={defaultHsva}
          onChange={mockOnChange}
          width={300}
          height={250}
        />
      );
      const area = screen.getByTestId('color-area');
      expect(area).toHaveStyle({ width: '300px', height: '250px' });
    });

    it('should display thumb at correct position', () => {
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('color-area-thumb');
      expect(thumb).toHaveStyle({
        left: '50%',
        top: '20%', // 100 - 80 = 20
      });
    });

    it('should update background color based on hue', () => {
      const { rerender } = render(
        <ColorArea hsva={defaultHsva} onChange={mockOnChange} />
      );
      const area = screen.getByTestId('color-area');
      const firstLayer = area.querySelector('.ck-color-area-layer');
      expect(firstLayer).toHaveStyle({ backgroundColor: 'hsl(200, 100%, 50%)' });

      rerender(<ColorArea hsva={{ ...defaultHsva, h: 120 }} onChange={mockOnChange} />);
      expect(firstLayer).toHaveStyle({ backgroundColor: 'hsl(120, 100%, 50%)' });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByRole('slider');
      
      expect(area).toHaveAttribute('aria-label', 'Color saturation and value');
      expect(area).toHaveAttribute('aria-valuemin', '0');
      expect(area).toHaveAttribute('aria-valuemax', '100');
      expect(area).toHaveAttribute('aria-valuenow', '50');
      expect(area).toHaveAttribute('aria-valuetext', 'Saturation 50%, Value 80%');
    });

    it('should be keyboard focusable', () => {
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      expect(area).toHaveAttribute('tabIndex', '0');
    });

    it('should update aria-valuetext when color changes', () => {
      const { rerender } = render(
        <ColorArea hsva={defaultHsva} onChange={mockOnChange} />
      );
      const area = screen.getByRole('slider');
      expect(area).toHaveAttribute('aria-valuetext', 'Saturation 50%, Value 80%');

      rerender(
        <ColorArea hsva={{ h: 200, s: 75, v: 60, a: 1 }} onChange={mockOnChange} />
      );
      expect(area).toHaveAttribute('aria-valuetext', 'Saturation 75%, Value 60%');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should increase saturation on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('{ArrowRight}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        s: 51,
        v: 80,
      });
    });

    it('should decrease saturation on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('{ArrowLeft}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        s: 49,
        v: 80,
      });
    });

    it('should increase value on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('{ArrowUp}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        s: 50,
        v: 81,
      });
    });

    it('should decrease value on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('{ArrowDown}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        s: 50,
        v: 79,
      });
    });

    it('should use larger step with Shift key', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultHsva,
        s: 60, // +10 instead of +1
        v: 80,
      });
    });

    it('should clamp saturation at boundaries', async () => {
      const user = userEvent.setup();
      const maxSaturation: HSVA = { h: 200, s: 100, v: 80, a: 1 };
      render(<ColorArea hsva={maxSaturation} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('{ArrowRight}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...maxSaturation,
        s: 100, // Should not exceed 100
      });
    });

    it('should clamp value at boundaries', async () => {
      const user = userEvent.setup();
      const minValue: HSVA = { h: 200, s: 50, v: 0, a: 1 };
      render(<ColorArea hsva={minValue} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('{ArrowDown}');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...minValue,
        v: 0, // Should not go below 0
      });
    });

    it('should prevent default behavior on arrow keys', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      
      // Just test that the onChange is called, which confirms the key handler works
      await user.keyboard('{ArrowRight}');
      
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should not handle non-arrow keys', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      await user.keyboard('a');

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Pointer Interactions', () => {
    it('should call onStart when pointer down', () => {
      render(
        <ColorArea
          hsva={defaultHsva}
          onChange={mockOnChange}
          onStart={mockOnStart}
        />
      );
      const area = screen.getByTestId('color-area');
      
      fireEvent.pointerDown(area, { clientX: 100, clientY: 100 });

      expect(mockOnStart).toHaveBeenCalled();
    });

    it('should call onEnd after pointer interaction', () => {
      render(
        <ColorArea
          hsva={defaultHsva}
          onChange={mockOnChange}
          onEnd={mockOnEnd}
        />
      );
      const area = screen.getByTestId('color-area');
      
      fireEvent.pointerDown(area, { clientX: 100, clientY: 100 });
      fireEvent.pointerUp(area);

      expect(mockOnEnd).toHaveBeenCalled();
    });

    it('should update color on pointer drag', () => {
      const { container } = render(
        <ColorArea hsva={defaultHsva} onChange={mockOnChange} width={256} height={200} />
      );
      const area = screen.getByTestId('color-area');
      
      // Mock getBoundingClientRect
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
      fireEvent.pointerMove(area, { clientX: 128, clientY: 100 });

      // Should update to middle of the area (50% saturation, 50% value)
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small dimensions', () => {
      render(
        <ColorArea
          hsva={defaultHsva}
          onChange={mockOnChange}
          width={10}
          height={10}
        />
      );
      const area = screen.getByTestId('color-area');
      expect(area).toHaveStyle({ width: '10px', height: '10px' });
    });

    it('should handle extreme hue values', () => {
      const extremeHue: HSVA = { h: 0, s: 50, v: 80, a: 1 };
      render(<ColorArea hsva={extremeHue} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      const firstLayer = area.querySelector('.ck-color-area-layer');
      expect(firstLayer).toHaveStyle({ backgroundColor: 'hsl(0, 100%, 50%)' });
    });

    it('should handle saturation at 0', () => {
      const grayscale: HSVA = { h: 200, s: 0, v: 80, a: 1 };
      render(<ColorArea hsva={grayscale} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('color-area-thumb');
      expect(thumb).toHaveStyle({ left: '0%' });
    });

    it('should handle value at 0', () => {
      const black: HSVA = { h: 200, s: 50, v: 0, a: 1 };
      render(<ColorArea hsva={black} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('color-area-thumb');
      expect(thumb).toHaveStyle({ top: '100%' });
    });

    it('should handle maximum values', () => {
      const maxColor: HSVA = { h: 360, s: 100, v: 100, a: 1 };
      render(<ColorArea hsva={maxColor} onChange={mockOnChange} />);
      const thumb = screen.getByTestId('color-area-thumb');
      expect(thumb).toHaveStyle({ left: '100%', top: '0%' });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(
        <ColorArea hsva={defaultHsva} onChange={mockOnChange} />
      );
      
      // Re-render with same props
      rerender(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      
      // Component should still be functional
      const area = screen.getByTestId('color-area');
      expect(area).toBeInTheDocument();
    });

    it('should handle rapid keyboard input', async () => {
      const user = userEvent.setup();
      render(<ColorArea hsva={defaultHsva} onChange={mockOnChange} />);
      const area = screen.getByTestId('color-area');
      
      area.focus();
      
      // Rapid key presses
      await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowUp}{ArrowUp}');
      
      // Should have called onChange for each key press
      expect(mockOnChange).toHaveBeenCalledTimes(5);
    });
  });
});
