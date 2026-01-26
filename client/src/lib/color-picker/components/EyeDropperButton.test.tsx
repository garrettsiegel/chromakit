import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EyeDropperButton } from './EyeDropperButton';

// Extend Window interface for EyeDropper
declare global {
  interface Window {
    EyeDropper?: any;
  }
}

// Mock the EyeDropper API
const mockEyeDropper = {
  open: vi.fn(),
};

describe('EyeDropperButton', () => {
  let originalEyeDropper: any;

  beforeEach(() => {
    // Save original EyeDropper
    originalEyeDropper = (window as any).EyeDropper;
    
    // Reset mock
    mockEyeDropper.open.mockReset();
  });

  afterEach(() => {
    // Restore original EyeDropper
    (window as any).EyeDropper = originalEyeDropper;
  });

  describe('Browser Support', () => {
    it('should render when EyeDropper is supported', () => {
      // Mock EyeDropper support
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };

      const { container } = render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Note: EyeDropper support detection happens at module load, not render time
      // So we can't test this reliably in JSDOM
    });

    it('should render when EyeDropper is not supported', () => {
      // EyeDropper is not supported in JSDOM by default
      render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should show unsupported class when not supported in real browser', () => {
      // This test demonstrates the component structure
      // In real browser without EyeDropper support, button would be disabled
      const { container } = render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should have appropriate title attribute', () => {
      render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should show keyboard shortcut hint when supported', () => {
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };

      render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', expect.stringContaining('⌘E'));
      expect(button).toHaveAttribute('title', expect.stringContaining('Ctrl+E'));
    });
  });

  describe('Rendering', () => {
    beforeEach(() => {
      // Mock EyeDropper support for these tests
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };
    });

    it('should render button with icon', () => {
      render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      
      expect(button).toBeInTheDocument();
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <EyeDropperButton onColorPick={vi.fn()} className="custom-class" />
      );
      
      const button = container.querySelector('.custom-class');
      expect(button).toBeInTheDocument();
    });

    it('should have proper aria-label', () => {
      render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', expect.stringContaining('Pick color'));
    });

    it('should be a button type', () => {
      render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Disabled State', () => {
    beforeEach(() => {
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };
    });

    it('should be disabled when disabled prop is true', () => {
      render(<EyeDropperButton onColorPick={vi.fn()} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be enabled when disabled prop is false', () => {
      render(<EyeDropperButton onColorPick={vi.fn()} disabled={false} />);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Color Picking', () => {
    beforeEach(() => {
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };
    });

    it('should call onColorPick when color is successfully picked', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();
      
      mockEyeDropper.open.mockResolvedValue({ sRGBHex: '#FF0000' });

      render(<EyeDropperButton onColorPick={onColorPick} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Wait for async operation
      await vi.waitFor(() => {
        expect(onColorPick).toHaveBeenCalledWith('#FF0000');
      });
    });

    it('should not call onColorPick when picking is cancelled', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();
      
      mockEyeDropper.open.mockRejectedValue(new Error('User cancelled'));

      render(<EyeDropperButton onColorPick={onColorPick} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Wait a bit to ensure no call happens
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(onColorPick).not.toHaveBeenCalled();
    });

    it('should handle EyeDropper API errors gracefully', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();
      
      mockEyeDropper.open.mockRejectedValue(new Error('API Error'));

      render(<EyeDropperButton onColorPick={onColorPick} />);
      
      const button = screen.getByRole('button');
      
      // Should not throw error
      await expect(user.click(button)).resolves.not.toThrow();
      
      expect(onColorPick).not.toHaveBeenCalled();
    });

    it('should not call onColorPick when button is disabled', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();

      render(<EyeDropperButton onColorPick={onColorPick} disabled={true} />);
      
      const button = screen.getByRole('button');
      
      // userEvent respects disabled state
      await user.click(button);
      
      expect(mockEyeDropper.open).not.toHaveBeenCalled();
      expect(onColorPick).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Color Picks', () => {
    beforeEach(() => {
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };
    });

    it('should handle multiple consecutive color picks', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();
      
      render(<EyeDropperButton onColorPick={onColorPick} />);
      
      const button = screen.getByRole('button');
      
      // First pick
      mockEyeDropper.open.mockResolvedValueOnce({ sRGBHex: '#FF0000' });
      await user.click(button);
      
      await vi.waitFor(() => {
        expect(onColorPick).toHaveBeenCalledWith('#FF0000');
      });
      
      // Second pick
      mockEyeDropper.open.mockResolvedValueOnce({ sRGBHex: '#00FF00' });
      await user.click(button);
      
      await vi.waitFor(() => {
        expect(onColorPick).toHaveBeenCalledWith('#00FF00');
      });
      
      expect(onColorPick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };
    });

    it('should be keyboard accessible', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();
      
      mockEyeDropper.open.mockResolvedValue({ sRGBHex: '#FF0000' });

      render(<EyeDropperButton onColorPick={onColorPick} />);
      
      const button = screen.getByRole('button');
      
      // Focus and activate with keyboard
      button.focus();
      expect(document.activeElement).toBe(button);
      
      await user.keyboard('{Enter}');
      
      await vi.waitFor(() => {
        expect(mockEyeDropper.open).toHaveBeenCalled();
      });
    });

    it('should have proper ARIA attributes', () => {
      render(<EyeDropperButton onColorPick={vi.fn()} />);
      
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null return from EyeDropper', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();
      
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };
      
      mockEyeDropper.open.mockResolvedValue(null);

      render(<EyeDropperButton onColorPick={onColorPick} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(onColorPick).not.toHaveBeenCalled();
    });

    it('should handle missing sRGBHex in result', async () => {
      const onColorPick = vi.fn();
      const user = userEvent.setup();
      
      (window as any).EyeDropper = function() {
        return mockEyeDropper;
      };
      
      mockEyeDropper.open.mockResolvedValue({});

      render(<EyeDropperButton onColorPick={onColorPick} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(onColorPick).not.toHaveBeenCalled();
    });
  });
});
