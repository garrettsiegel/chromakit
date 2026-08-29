import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';
import { clearColorHistory } from '../utils';

// Prop wiring that the original ColorPicker suite left uncovered: preset
// editing, history persistence, input-mode switching, and the eyedropper.
describe('ColorPicker behavior', () => {
  beforeEach(() => {
    clearColorHistory();
    localStorage.clear();
  });

  const presetSwatches = () =>
    within(screen.getByTestId('preset-colors')).getAllByTestId('color-swatch');

  const enterPresetEditMode = async (
    user: ReturnType<typeof userEvent.setup>
  ) => user.click(screen.getByLabelText('Edit presets'));

  describe('Preset editing', () => {
    it('adds the current color as a new preset', async () => {
      const user = userEvent.setup();
      render(<ColorPicker presets={['#ff0000']} defaultValue="#00ff00" />);

      const before = presetSwatches().length;
      await enterPresetEditMode(user);
      await user.click(screen.getByTitle('Add current color as preset'));

      await waitFor(() => {
        expect(presetSwatches()).toHaveLength(before + 1);
      });
    });

    it('deletes a preset', async () => {
      const user = userEvent.setup();
      render(<ColorPicker presets={['#ff0000', '#00ff00', '#0000ff']} />);

      const before = presetSwatches().length;
      await enterPresetEditMode(user);
      await user.click(screen.getAllByLabelText('Delete preset')[0]);

      await waitFor(() => {
        expect(presetSwatches()).toHaveLength(before - 1);
      });
    });

    it('updates a preset to the current color while editing', async () => {
      const user = userEvent.setup();
      render(<ColorPicker presets={['#ff0000']} defaultValue="#00ff00" />);

      await enterPresetEditMode(user);
      await user.click(presetSwatches()[0]);

      await waitFor(() => {
        const swatch = presetSwatches()[0].querySelector('.ck-swatch-color');
        expect(swatch).toHaveStyle({ backgroundColor: 'rgb(0, 255, 0)' });
      });
    });

    it('selecting a preset updates the color and calls onChangeComplete', async () => {
      const onChangeComplete = vi.fn();
      const user = userEvent.setup();

      render(
        <ColorPicker
          presets={['#ff0000']}
          defaultValue="#000000"
          onChangeComplete={onChangeComplete}
        />
      );

      await user.click(presetSwatches()[0]);

      await waitFor(() => {
        expect(onChangeComplete).toHaveBeenCalled();
      });
      expect(screen.getByTestId('color-input-text')).toHaveValue('#ff0000');
    });

    it('loads a preset group', async () => {
      const user = userEvent.setup();
      render(
        <ColorPicker
          presets={['#ff0000']}
          presetGroups={{ Ocean: ['#001f3f', '#0074d9', '#7fdbff'] }}
        />
      );

      await user.selectOptions(
        screen.getByLabelText('Preset color group'),
        'Ocean'
      );

      await waitFor(() => {
        expect(presetSwatches()).toHaveLength(3);
      });
    });

    it('accepts preset groups given as an array', () => {
      render(
        <ColorPicker
          presetGroups={[{ name: 'Warm', colors: ['#ff0000', '#ff8800'] }]}
        />
      );
      expect(screen.getByLabelText('Preset color group')).toBeInTheDocument();
    });
  });

  describe('Color history', () => {
    it('records a color when a preset is chosen', async () => {
      const user = userEvent.setup();
      render(<ColorPicker presets={['#abcdef']} enableHistory />);

      await user.click(presetSwatches()[0]);

      await waitFor(() => {
        expect(localStorage.getItem('chromakit-color-history')).toContain(
          '#abcdef'
        );
      });
    });

    it('does not record history when disabled', async () => {
      const user = userEvent.setup();
      render(<ColorPicker presets={['#abcdef']} enableHistory={false} />);

      await user.click(presetSwatches()[0]);

      await waitFor(() => {
        expect(screen.getByTestId('color-input-text')).toHaveValue('#abcdef');
      });
      expect(localStorage.getItem('chromakit-color-history')).toBeNull();
    });

    it('honors historySize', async () => {
      const user = userEvent.setup();
      render(
        <ColorPicker
          presets={['#111111', '#222222', '#333333']}
          historySize={2}
        />
      );

      await user.click(presetSwatches()[0]);
      await user.click(presetSwatches()[1]);
      await user.click(presetSwatches()[2]);

      await waitFor(() => {
        const stored = JSON.parse(
          localStorage.getItem('chromakit-color-history') || '[]'
        );
        expect(stored).toHaveLength(2);
      });
    });
  });

  describe('Input modes', () => {
    it('offers an OKLAB mode and edits through it', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <ColorPicker
          formats={['oklab']}
          defaultValue="#ff0000"
          onChange={onChange}
        />
      );

      await user.click(screen.getByTestId('input-mode-oklab'));

      const lightness = screen.getByTestId('oklab-input-l');
      expect(lightness).toBeInTheDocument();

      await user.clear(lightness);
      await user.type(lightness, '0.5');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('switches between rgb, hsl, hsv, oklch and oklab', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      for (const mode of ['rgb', 'hsl', 'hsv', 'oklch', 'oklab']) {
        await user.click(screen.getByTestId(`input-mode-${mode}`));
        expect(screen.getByTestId(`input-mode-${mode}`)).toHaveClass('active');
      }
    });

    it('falls back to an available mode when formats exclude the current one', () => {
      const { rerender } = render(<ColorPicker formats={['rgb']} />);
      rerender(<ColorPicker formats={['hsl']} />);
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });
  });

  describe('Named color input', () => {
    it('accepts a CSS keyword typed into the text field', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<ColorPicker onChange={onChange} defaultValue="#000000" />);

      const input = screen.getByTestId('color-input-text');
      await user.tripleClick(input);
      await user.paste('rebeccapurple');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ hex: '#663399' })
        );
      });
    });
  });

  describe('EyeDropper integration', () => {
    it('is absent when the browser lacks the API', () => {
      render(<ColorPicker />);
      expect(screen.queryByTestId('eyedropper-button')).not.toBeInTheDocument();
    });

    it('applies a sampled color to the picker', async () => {
      Object.defineProperty(window, 'EyeDropper', {
        configurable: true,
        writable: true,
        value: class {
          open = () => Promise.resolve({ sRGBHex: '#00ff00' });
        },
      });

      const user = userEvent.setup();
      render(<ColorPicker defaultValue="#ff0000" />);

      await user.click(screen.getByTestId('eyedropper-button'));

      await waitFor(() => {
        expect(screen.getByTestId('color-input-text')).toHaveValue('#00ff00');
      });

      Reflect.deleteProperty(
        window as unknown as Record<string, unknown>,
        'EyeDropper'
      );
    });

    it('can be hidden with showEyeDropper', () => {
      Object.defineProperty(window, 'EyeDropper', {
        configurable: true,
        writable: true,
        value: class {
          open = () => Promise.resolve({ sRGBHex: '#00ff00' });
        },
      });

      render(<ColorPicker showEyeDropper={false} />);
      expect(screen.queryByTestId('eyedropper-button')).not.toBeInTheDocument();

      Reflect.deleteProperty(
        window as unknown as Record<string, unknown>,
        'EyeDropper'
      );
    });
  });
});
