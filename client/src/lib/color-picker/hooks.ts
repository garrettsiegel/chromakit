import { useState, useCallback, useRef, useEffect } from 'react';
import type { HSVA, ColorValue } from './types';
import { parseColor, rgbaToColorValue, hsvaToRgba } from './conversions';

export function useColorState(
  initialColor: string = '#000000',
  onChange?: (color: ColorValue) => void,
  onChangeComplete?: (color: ColorValue) => void
) {
  const [hsva, setHsva] = useState<HSVA>(() => {
    const rgba = parseColor(initialColor);
    if (rgba) {
      const colorValue = rgbaToColorValue(rgba);
      return colorValue.hsva;
    }
    return { h: 0, s: 100, v: 100, a: 1 };
  });
  
  const [colorValue, setColorValue] = useState<ColorValue>(() => {
    const rgba = parseColor(initialColor);
    return rgba ? rgbaToColorValue(rgba) : rgbaToColorValue({ r: 0, g: 0, b: 0, a: 1 });
  });

  const isDragging = useRef(false);

  const updateColor = useCallback((newHsva: HSVA) => {
    setHsva(newHsva);
    const rgba = hsvaToRgba(newHsva);
    const newColorValue = rgbaToColorValue(rgba);
    setColorValue(newColorValue);
    onChange?.(newColorValue);
  }, [onChange]);

  const setFromString = useCallback((colorString: string): ColorValue | null => {
    const rgba = parseColor(colorString);
    if (rgba) {
      const newColorValue = rgbaToColorValue(rgba);
      setColorValue(newColorValue);
      setHsva(newColorValue.hsva);
      onChange?.(newColorValue);
      return newColorValue;
    }
    return null;
  }, [onChange]);

  const startDrag = useCallback(() => {
    isDragging.current = true;
  }, []);

  const endDrag = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      onChangeComplete?.(colorValue);
    }
  }, [colorValue, onChangeComplete]);

  return {
    hsva,
    colorValue,
    updateColor,
    setFromString,
    startDrag,
    endDrag,
    isDragging,
  };
}

export function usePointerDrag(
  onMove: (position: { x: number; y: number }) => void,
  onStart?: () => void,
  onEnd?: () => void
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getPosition = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return { x, y };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    onStart?.();
    const pos = getPosition(e);
    onMove(pos);
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const pos = getPosition(e);
      onMove(pos);
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      onEnd?.();
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, [getPosition, onMove, onStart, onEnd]);

  return {
    containerRef,
    handlePointerDown,
  };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
