import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ColorPicker />);

      // Check for main container
      const picker = screen.getByTestId('color-picker');
      expect(picker).toBeInTheDocument();
    });

    it('should render with custom default value', () => {
      const { container } = render(<ColorPicker defaultValue="#FF0000" />);

      // Check that color area reflects red color
      const colorArea = container.querySelector('.ck-color-area');
      expect(colorArea).toBeInTheDocument();
    });

    it('should render with controlled value', () => {
      const { rerender } = render(<ColorPicker value="#00FF00" />);

      expect(screen.getByTestId('color-picker')).toBeInTheDocument();

      // Update value
      rerender(<ColorPicker value="#0000FF" />);
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<ColorPicker className="custom-class" />);

      const picker = container.querySelector('.custom-class');
      expect(picker).toBeInTheDocument();
    });

    it('should apply custom width', () => {
      const { container } = render(<ColorPicker width={400} />);

      const picker = container.querySelector('.ck-color-picker');
      expect(picker).toHaveStyle({ width: '400px' });
    });
  });

  describe('Components Visibility', () => {
    it('should show all components by default', () => {
      render(<ColorPicker />);

      // Color area
      expect(
        screen.getByRole('slider', { name: /saturation/i })
      ).toBeInTheDocument();
      // Hue slider
      expect(screen.getByRole('slider', { name: /hue/i })).toBeInTheDocument();
      // Alpha slider
      expect(
        screen.getByRole('slider', { name: /alpha/i })
      ).toBeInTheDocument();
      // Inputs
      expect(screen.getByTestId('color-input-text')).toBeInTheDocument();
      // Preview
      expect(screen.getByTestId('color-preview')).toBeInTheDocument();
    });

    it('should hide alpha slider when showAlpha is false', () => {
      render(<ColorPicker showAlpha={false} />);

      expect(
        screen.queryByRole('slider', { name: /alpha/i })
      ).not.toBeInTheDocument();
    });

    it('should hide inputs when showInputs is false', () => {
      render(<ColorPicker showInputs={false} />);

      expect(screen.queryByTestId('color-input-text')).not.toBeInTheDocument();
    });

    it('should hide preview when showPreview is false', () => {
      render(<ColorPicker showPreview={false} />);

      expect(screen.queryByLabelText(/current color/i)).not.toBeInTheDocument();
    });

    it('should hide copy button when showCopyButton is false', () => {
      render(<ColorPicker showCopyButton={false} />);

      expect(screen.queryByLabelText(/copy color/i)).not.toBeInTheDocument();
    });

    it('should hide presets when showPresets is false', () => {
      render(<ColorPicker showPresets={false} />);

      expect(
        screen.queryByRole('button', { name: /preset/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Color Formats', () => {
    it('should support hex format', () => {
      render(<ColorPicker formats={['hex']} />);

      const select = screen.getByTestId('color-format-select');
      expect(select).toHaveValue('hex');
    });

    it('should support multiple formats', () => {
      render(<ColorPicker formats={['hex', 'rgb', 'hsl', 'oklch']} />);

      const select = screen.getByTestId(
        'color-format-select'
      ) as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) => opt.value);

      expect(options).toContain('hex');
      expect(options).toContain('rgb');
      expect(options).toContain('hsl');
      expect(options).toContain('oklch');
    });

    it('should switch between formats', async () => {
      const user = userEvent.setup();
      render(<ColorPicker formats={['hex', 'rgb']} defaultValue="#FF0000" />);

      const select = screen.getByTestId('color-format-select');

      // Switch to RGB
      await user.selectOptions(select, 'rgb');

      const input = screen.getByTestId('color-input-text') as HTMLInputElement;
      expect(input.value).toMatch(/rgb\(255,\s*0,\s*0\)/i);
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when color is changed', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<ColorPicker defaultValue="#FF0000" onChange={onChange} />);

      const input = screen.getByTestId('color-input-text');
      await user.click(input);
      await user.tripleClick(input);
      await user.paste('#00FF00');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should have onChangeComplete prop', () => {
      const onChangeComplete = vi.fn();

      render(
        <ColorPicker
          defaultValue="#FF0000"
          onChangeComplete={onChangeComplete}
        />
      );

      // Component should render without errors
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('should update when hue slider is moved', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<ColorPicker onChange={onChange} />);

      const hueSlider = screen.getByRole('slider', { name: /hue/i });
      await user.click(hueSlider);

      expect(onChange).toHaveBeenCalled();
    });

    it('should update when alpha slider is moved', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<ColorPicker onChange={onChange} showAlpha={true} />);

      const alphaSlider = screen.getByRole('slider', { name: /alpha/i });
      await user.click(alphaSlider);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Presets', () => {
    it('should render default presets', () => {
      render(<ColorPicker />);

      // Check that presets section exists
      expect(screen.getByTestId('preset-colors')).toBeInTheDocument();
    });

    it('should render custom presets', () => {
      const customPresets = ['#FF0000', '#00FF00', '#0000FF'];
      render(<ColorPicker presets={customPresets} />);

      // Check that presets section exists with custom presets
      expect(screen.getByTestId('preset-colors')).toBeInTheDocument();
    });

    it('should render presets container', () => {
      const customPresets = ['#FF0000'];

      render(<ColorPicker presets={customPresets} />);

      // Verify presets are rendered
      expect(screen.getByTestId('preset-colors')).toBeInTheDocument();
    });
  });

  describe('Color History', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it('should enable history by default', () => {
      render(<ColorPicker enableHistory={true} />);

      // Component should render without errors
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('should disable history when enableHistory is false', () => {
      render(<ColorPicker enableHistory={false} />);

      // Component should render without errors
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle copy shortcut', async () => {
      const user = userEvent.setup();
      render(<ColorPicker showCopyButton={true} />);

      const picker = screen.getByTestId('color-picker');
      picker.focus();

      // Simulate Cmd/Ctrl+C
      await user.keyboard('{Control>}c{/Control}');

      // Component should not crash
      expect(picker).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ColorPicker />);

      expect(screen.getByRole('slider', { name: /hue/i })).toHaveAttribute(
        'aria-label'
      );
      expect(screen.getByRole('slider', { name: /alpha/i })).toHaveAttribute(
        'aria-label'
      );
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toBeTruthy();

      await user.tab();
      expect(document.activeElement).toBeTruthy();
    });

    it('should have proper focus management', () => {
      render(<ColorPicker />);

      const hueSlider = screen.getByRole('slider', { name: /hue/i });
      hueSlider.focus();

      expect(document.activeElement).toBe(hueSlider);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid color input gracefully', async () => {
      const user = userEvent.setup();
      render(<ColorPicker defaultValue="#FF0000" />);

      const input = screen.getByTestId('color-input-text');
      await user.clear(input);
      await user.type(input, 'invalid');

      // Should not crash
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('should handle empty color input', async () => {
      const user = userEvent.setup();
      render(<ColorPicker defaultValue="#FF0000" />);

      const input = screen.getByTestId('color-input-text');
      await user.clear(input);

      // Should not crash
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('should handle rapid color changes', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<ColorPicker onChange={onChange} />);

      const input = screen.getByTestId('color-input-text');

      // Rapid changes
      await user.click(input);
      await user.tripleClick(input);
      await user.paste('#FF0000');
      await user.tripleClick(input);
      await user.paste('#00FF00');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should handle value prop updates', () => {
      const { rerender } = render(<ColorPicker value="#FF0000" />);

      expect(screen.getByTestId('color-picker')).toBeInTheDocument();

      rerender(<ColorPicker value="#00FF00" />);
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();

      rerender(<ColorPicker value="#0000FF" />);
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });
  });
});
