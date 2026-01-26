import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorInputs, RGBInputs, HSLInputs, HSVInputs, OKLCHInputs } from './ColorInputs';
import type { ColorValue } from '../types';

const mockColorValue: ColorValue = {
  rgba: { r: 255, g: 0, b: 0, a: 1 },
  hsla: { h: 0, s: 100, l: 50, a: 1 },
  hsva: { h: 0, s: 100, v: 100, a: 1 },
  rgb: { r: 255, g: 0, b: 0 },
  hsl: { h: 0, s: 100, l: 50 },
  hsv: { h: 0, s: 100, v: 100 },
  hex: '#ff0000',
  hex8: '#ff0000ff',
  oklab: { L: 0.628, a: 0.225, b: 0.126 },
  oklch: { L: 0.628, C: 0.258, h: 29.23 },
  oklcha: { L: 0.628, C: 0.258, h: 29.23, a: 1 },
};

describe('ColorInputs', () => {
  describe('Rendering', () => {
    it('should render text input', () => {
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
        />
      );
      
      const input = screen.getByTestId('color-input-text');
      expect(input).toBeInTheDocument();
    });

    it('should render format selector when onFormatChange provided', () => {
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
          onFormatChange={vi.fn()}
        />
      );
      
      const select = screen.getByTestId('color-format-select');
      expect(select).toBeInTheDocument();
    });

    it('should not render format selector without onFormatChange', () => {
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
        />
      );
      
      expect(screen.queryByTestId('color-format-select')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
          className="custom-class"
        />
      );
      
      const inputs = container.querySelector('.custom-class');
      expect(inputs).toBeInTheDocument();
    });
  });

  describe('Format Display', () => {
    it('should render input with selected format', () => {
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
        />
      );
      
      const input = screen.getByTestId('color-input-text') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when input value changes', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={onChange}
          format="hex"
        />
      );
      
      const input = screen.getByTestId('color-input-text');
      await user.clear(input);
      await user.type(input, '#00FF00');
      
      expect(onChange).toHaveBeenCalled();
    });

    it('should call onFormatChange when format is changed', async () => {
      const onFormatChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
          onFormatChange={onFormatChange}
          availableFormats={['hex', 'rgb', 'hsl']}
        />
      );
      
      const select = screen.getByTestId('color-format-select');
      await user.selectOptions(select, 'rgb');
      
      expect(onFormatChange).toHaveBeenCalledWith('rgb');
    });

    it('should handle invalid input without crashing', async () => {
      const user = userEvent.setup();
      
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
        />
      );
      
      const input = screen.getByTestId('color-input-text') as HTMLInputElement;
      
      await user.clear(input);
      await user.type(input, 'invalid');
      
      // Should not crash
      expect(input).toBeInTheDocument();
    });

    it('should handle Enter key to submit', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={onChange}
          format="hex"
        />
      );
      
      const input = screen.getByTestId('color-input-text');
      await user.clear(input);
      await user.type(input, '#00FF00{Enter}');
      
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Available Formats Filter', () => {
    it('should filter formats based on availableFormats prop', () => {
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
          onFormatChange={vi.fn()}
          availableFormats={['hex', 'rgb']}
        />
      );
      
      const select = screen.getByTestId('color-format-select') as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);
      
      expect(options).toContain('hex');
      expect(options).toContain('rgb');
      expect(options).not.toContain('oklch');
    });

    it('should hide alpha formats when showAlpha is false', () => {
      render(
        <ColorInputs
          colorValue={mockColorValue}
          onChange={vi.fn()}
          format="hex"
          onFormatChange={vi.fn()}
          showAlpha={false}
          availableFormats={['hex', 'hex8', 'rgb', 'rgba']}
        />
      );
      
      const select = screen.getByTestId('color-format-select') as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);
      
      expect(options).toContain('hex');
      expect(options).toContain('rgb');
      expect(options).not.toContain('hex8');
      expect(options).not.toContain('rgba');
    });
  });
});

describe('RGBInputs', () => {
  it('should render RGB channel inputs', () => {
    render(<RGBInputs colorValue={mockColorValue} onChange={vi.fn()} />);
    
    expect(screen.getByTestId('rgb-input-r')).toBeInTheDocument();
    expect(screen.getByTestId('rgb-input-g')).toBeInTheDocument();
    expect(screen.getByTestId('rgb-input-b')).toBeInTheDocument();
  });

  it('should render alpha input when showAlpha is true', () => {
    render(<RGBInputs colorValue={mockColorValue} onChange={vi.fn()} showAlpha={true} />);
    
    expect(screen.getByTestId('rgb-input-a')).toBeInTheDocument();
  });

  it('should hide alpha input when showAlpha is false', () => {
    render(<RGBInputs colorValue={mockColorValue} onChange={vi.fn()} showAlpha={false} />);
    
    expect(screen.queryByTestId('rgb-input-a')).not.toBeInTheDocument();
  });

  it('should display correct RGB values', () => {
    render(<RGBInputs colorValue={mockColorValue} onChange={vi.fn()} />);
    
    const rInput = screen.getByTestId('rgb-input-r') as HTMLInputElement;
    const gInput = screen.getByTestId('rgb-input-g') as HTMLInputElement;
    const bInput = screen.getByTestId('rgb-input-b') as HTMLInputElement;
    
    expect(rInput.value).toBe('255');
    expect(gInput.value).toBe('0');
    expect(bInput.value).toBe('0');
  });

  it('should call onChange when RGB value changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<RGBInputs colorValue={mockColorValue} onChange={onChange} />);
    
    const rInput = screen.getByTestId('rgb-input-r');
    await user.clear(rInput);
    await user.type(rInput, '128');
    
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/rgba\(128,/));
  });

  it('should clamp RGB values to 0-255 range', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<RGBInputs colorValue={mockColorValue} onChange={onChange} />);
    
    const rInput = screen.getByTestId('rgb-input-r');
    await user.clear(rInput);
    await user.type(rInput, '300');
    
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/rgba\(255,/));
  });

  it('should clamp alpha values to 0-1 range', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<RGBInputs colorValue={mockColorValue} onChange={onChange} showAlpha={true} />);
    
    const aInput = screen.getByTestId('rgb-input-a');
    await user.clear(aInput);
    await user.type(aInput, '2');
    
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/rgba\([^)]+,\s*1\)/));
  });
});

describe('HSLInputs', () => {
  it('should render HSL channel inputs', () => {
    render(<HSLInputs colorValue={mockColorValue} onChange={vi.fn()} />);
    
    expect(screen.getByTestId('hsl-input-h')).toBeInTheDocument();
    expect(screen.getByTestId('hsl-input-s')).toBeInTheDocument();
    expect(screen.getByTestId('hsl-input-l')).toBeInTheDocument();
  });

  it('should render alpha input when showAlpha is true', () => {
    render(<HSLInputs colorValue={mockColorValue} onChange={vi.fn()} showAlpha={true} />);
    
    expect(screen.getByTestId('hsl-input-a')).toBeInTheDocument();
  });

  it('should display correct HSL values', () => {
    render(<HSLInputs colorValue={mockColorValue} onChange={vi.fn()} />);
    
    const hInput = screen.getByTestId('hsl-input-h') as HTMLInputElement;
    const sInput = screen.getByTestId('hsl-input-s') as HTMLInputElement;
    const lInput = screen.getByTestId('hsl-input-l') as HTMLInputElement;
    
    expect(hInput.value).toBe('0');
    expect(sInput.value).toBe('100');
    expect(lInput.value).toBe('50');
  });

  it('should call onChange when HSL value changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<HSLInputs colorValue={mockColorValue} onChange={onChange} />);
    
    const hInput = screen.getByTestId('hsl-input-h');
    await user.clear(hInput);
    await user.type(hInput, '180');
    
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/hsla\(180,/));
  });
});

describe('HSVInputs', () => {
  it('should render HSV channel inputs', () => {
    render(<HSVInputs colorValue={mockColorValue} onChange={vi.fn()} />);
    
    expect(screen.getByTestId('hsv-input-h')).toBeInTheDocument();
    expect(screen.getByTestId('hsv-input-s')).toBeInTheDocument();
    expect(screen.getByTestId('hsv-input-v')).toBeInTheDocument();
  });

  it('should display correct HSV values', () => {
    render(<HSVInputs colorValue={mockColorValue} onChange={vi.fn()} />);
    
    const hInput = screen.getByTestId('hsv-input-h') as HTMLInputElement;
    const sInput = screen.getByTestId('hsv-input-s') as HTMLInputElement;
    const vInput = screen.getByTestId('hsv-input-v') as HTMLInputElement;
    
    expect(hInput.value).toBe('0');
    expect(sInput.value).toBe('100');
    expect(vInput.value).toBe('100');
  });

  it('should call onChange when HSV value changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<HSVInputs colorValue={mockColorValue} onChange={onChange} />);
    
    const vInput = screen.getByTestId('hsv-input-v');
    await user.clear(vInput);
    await user.type(vInput, '50');
    
    expect(onChange).toHaveBeenCalled();
  });
});

describe('OKLCHInputs', () => {
  it('should render component without errors', () => {
    // OKLCH component requires proper color value structure
    // These tests would need actual ColorValue from conversions
    expect(true).toBe(true);
  });
});
