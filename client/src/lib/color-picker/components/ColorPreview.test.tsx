import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorPreview } from './ColorPreview';
import { ColorSwatch } from './ColorSwatch';
import { PresetColors } from './PresetColors';
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

describe('ColorPreview', () => {
  it('renders a swatch styled with the current color', () => {
    render(<ColorPreview colorValue={mockColorValue} />);

    const preview = screen.getByTestId('color-preview');
    const swatch = preview.querySelector('.ck-preview-color') as HTMLElement;
    // jsdom normalizes alpha=1 rgba() down to rgb()
    expect(swatch.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('renders a before/after comparison when showComparison is set', () => {
    render(
      <ColorPreview
        colorValue={mockColorValue}
        showComparison
        originalColor="#0000ff"
      />
    );

    expect(screen.queryByTestId('color-preview')).not.toBeInTheDocument();
  });
});

describe('ColorSwatch', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('calls onClick on a plain click', () => {
    const onClick = vi.fn();
    render(<ColorSwatch color="#ff0000" onClick={onClick} />);

    fireEvent.click(screen.getByTestId('color-swatch'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onLongPress after holding for 500ms, not onClick', () => {
    const onClick = vi.fn();
    const onLongPress = vi.fn();
    render(
      <ColorSwatch color="#ff0000" onClick={onClick} onLongPress={onLongPress} />
    );

    const swatch = screen.getByTestId('color-swatch');
    fireEvent.mouseDown(swatch);
    vi.advanceTimersByTime(500);
    fireEvent.mouseUp(swatch);

    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not trigger onLongPress if released early', () => {
    const onClick = vi.fn();
    const onLongPress = vi.fn();
    render(
      <ColorSwatch color="#ff0000" onClick={onClick} onLongPress={onLongPress} />
    );

    const swatch = screen.getByTestId('color-swatch');
    fireEvent.mouseDown(swatch);
    vi.advanceTimersByTime(200);
    fireEvent.mouseUp(swatch);
    fireEvent.click(swatch);

    expect(onLongPress).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete without triggering onClick when editing', () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    render(
      <ColorSwatch
        color="#ff0000"
        onClick={onClick}
        onDelete={onDelete}
        editing
      />
    );

    fireEvent.click(screen.getByTitle('Delete preset'));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('PresetColors', () => {
  it('renders a swatch per color', () => {
    render(
      <PresetColors
        colors={['#ff0000', '#00ff00', '#0000ff']}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getAllByTestId('color-swatch')).toHaveLength(3);
  });

  it('calls onSelect when a swatch is clicked outside of edit mode', () => {
    const onSelect = vi.fn();
    render(<PresetColors colors={['#ff0000']} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId('color-swatch'));

    expect(onSelect).toHaveBeenCalledWith('#ff0000');
  });

  it('calls onUpdatePreset instead of onSelect when in edit mode', () => {
    const onSelect = vi.fn();
    const onUpdatePreset = vi.fn();
    render(
      <PresetColors
        colors={['#ff0000']}
        onSelect={onSelect}
        onUpdatePreset={onUpdatePreset}
      />
    );

    fireEvent.click(screen.getByTitle('Edit presets'));
    fireEvent.click(screen.getByTestId('color-swatch'));

    expect(onUpdatePreset).toHaveBeenCalledWith(0);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onDeletePreset for a swatch delete button in edit mode', () => {
    const onDeletePreset = vi.fn();
    render(
      <PresetColors
        colors={['#ff0000', '#00ff00']}
        onSelect={vi.fn()}
        onDeletePreset={onDeletePreset}
      />
    );

    fireEvent.click(screen.getByTitle('Edit presets'));
    const deleteButtons = screen.getAllByTitle('Delete preset');
    fireEvent.click(deleteButtons[1]);

    expect(onDeletePreset).toHaveBeenCalledWith(1);
  });

  it('shows an add-preset button in edit mode below the 24-color limit', () => {
    const onAddPreset = vi.fn();
    render(
      <PresetColors
        colors={['#ff0000']}
        onSelect={vi.fn()}
        onAddPreset={onAddPreset}
      />
    );

    fireEvent.click(screen.getByTitle('Edit presets'));
    fireEvent.click(screen.getByTitle('Add current color as preset'));

    expect(onAddPreset).toHaveBeenCalledTimes(1);
  });

  it('hides the add-preset button once the 24-color limit is reached', () => {
    const colors = Array.from({ length: 24 }, (_, i) =>
      `#${i.toString(16).padStart(6, '0')}`
    );
    render(
      <PresetColors colors={colors} onSelect={vi.fn()} onAddPreset={vi.fn()} />
    );

    fireEvent.click(screen.getByTitle('Edit presets'));

    expect(
      screen.queryByTitle('Add current color as preset')
    ).not.toBeInTheDocument();
  });

  it('loads a preset group via the dropdown', () => {
    const onLoadPresetGroup = vi.fn();
    render(
      <PresetColors
        colors={['#ff0000']}
        onSelect={vi.fn()}
        presetGroups={[{ name: 'Material', colors: ['#F44336'] }]}
        onLoadPresetGroup={onLoadPresetGroup}
      />
    );

    fireEvent.change(screen.getByLabelText('Preset color group'), {
      target: { value: 'Material' },
    });

    expect(onLoadPresetGroup).toHaveBeenCalledWith('Material');
  });
});
