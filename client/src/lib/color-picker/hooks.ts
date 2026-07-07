import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { HSVA, ColorValue } from './types';
import { parseColor, rgbaToColorValue, hsvaToRgba } from './conversions';

export function useColorState(
  initialColor: string = '#000000',
  onChange?: (color: ColorValue) => void,
  onChangeComplete?: (color: ColorValue) => void,
  controlledColor?: string
) {
  const [internalHsva, setInternalHsva] = useState<HSVA>(() => {
    const rgba = parseColor(initialColor);
    if (rgba) {
      const colorValue = rgbaToColorValue(rgba);
      return colorValue.hsva;
    }
    return { h: 0, s: 100, v: 100, a: 1 };
  });

  const [internalColorValue, setInternalColorValue] = useState<ColorValue>(() => {
    const rgba = parseColor(initialColor);
    return rgba
      ? rgbaToColorValue(rgba)
      : rgbaToColorValue({ r: 0, g: 0, b: 0, a: 1 });
  });

  const controlledColorValue = useMemo(() => {
    if (!controlledColor) {
      return null;
    }
    const rgba = parseColor(controlledColor);
    return rgba ? rgbaToColorValue(rgba) : null;
  }, [controlledColor]);

  const hsva = controlledColorValue?.hsva ?? internalHsva;
  const colorValue = controlledColorValue ?? internalColorValue;

  const isDragging = useRef(false);

  // Always holds the latest colorValue so endDrag reports the final color even
  // when a stale endDrag reference is invoked (e.g. captured by a pointerup
  // listener registered at drag start).
  const colorValueRef = useRef(colorValue);
  useEffect(() => {
    colorValueRef.current = colorValue;
  }, [colorValue]);

  const updateColor = useCallback(
    (newHsva: HSVA) => {
      const rgba = hsvaToRgba(newHsva);
      const newColorValue = rgbaToColorValue(rgba);
      if (!controlledColorValue) {
        setInternalHsva(newHsva);
        setInternalColorValue(newColorValue);
      }
      onChange?.(newColorValue);
    },
    [onChange, controlledColorValue]
  );

  const setFromString = useCallback(
    (colorString: string): ColorValue | null => {
      const rgba = parseColor(colorString);
      if (rgba) {
        const newColorValue = rgbaToColorValue(rgba);
        if (!controlledColorValue) {
          setInternalColorValue(newColorValue);
          setInternalHsva(newColorValue.hsva);
        }
        onChange?.(newColorValue);
        return newColorValue;
      }
      return null;
    },
    [onChange, controlledColorValue]
  );

  const startDrag = useCallback(() => {
    isDragging.current = true;
  }, []);

  const endDrag = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      onChangeComplete?.(colorValueRef.current);
    }
  }, [onChangeComplete]);

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
  onEnd?: () => void,
  externalRef?: React.RefObject<HTMLDivElement | null>
) {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = externalRef || internalRef;
  const isDragging = useRef(false);
  // Removes the active document listeners; set while a drag is in progress.
  const cleanupRef = useRef<(() => void) | null>(null);

  // Keep the latest callbacks in refs so document listeners registered at drag
  // start always call the current versions (avoids stale-closure bugs).
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onMoveRef.current = onMove;
    onEndRef.current = onEnd;
  });

  const getPosition = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      return { x, y };
    },
    [containerRef]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      isDragging.current = true;
      onStart?.();
      onMoveRef.current(getPosition(e));

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging.current) return;
        onMoveRef.current(getPosition(e));
      };

      const cleanup = () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        cleanupRef.current = null;
      };

      const handlePointerUp = () => {
        isDragging.current = false;
        onEndRef.current?.();
        cleanup();
      };

      cleanupRef.current = cleanup;
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [getPosition, onStart]
  );

  // Remove any listeners still attached if the component unmounts mid-drag.
  useEffect(() => () => cleanupRef.current?.(), []);

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
