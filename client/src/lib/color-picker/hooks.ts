import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import type { HSVA, ColorValue } from './types';
import { parseColor, rgbaToColorValue, hsvaToRgba } from './conversions';
import { clamp } from './conversions/math';

// RGB LOSES HUE FOR BLACK/WHITE/GRAY, SO CARRY THE PREVIOUS HUE AND SATURATION FORWARD
function preserveHueAndSaturation(next: HSVA, previous: HSVA): HSVA {
  return {
    ...next,
    h: next.s === 0 || next.v === 0 ? previous.h : next.h,
    s: next.v === 0 ? previous.s : next.s,
  };
}

export interface UseColorStateOptions {
  /** Controlled color. When set, the hook reflects it instead of internal state. */
  value?: string;
  /** Fires on every change (drag, typing). */
  onChange?: (color: ColorValue) => void;
  /** Fires once a drag ends, with the final color. */
  onChangeComplete?: (color: ColorValue) => void;
}

export function useColorState(
  initialColor: string = '#000000',
  {
    value: controlledColor,
    onChange,
    onChangeComplete,
  }: UseColorStateOptions = {}
) {
  // SEED FROM THE CONTROLLED VALUE SO THE FIRST RENDER KEEPS THE CALLER'S HUE
  const seedColor = controlledColor || initialColor;

  const [internalHsva, setInternalHsva] = useState<HSVA>(() => {
    const rgba = parseColor(seedColor);
    if (rgba) {
      const colorValue = rgbaToColorValue(rgba);
      return colorValue.hsva;
    }
    return { h: 0, s: 100, v: 100, a: 1 };
  });

  const [internalColorValue, setInternalColorValue] = useState<ColorValue>(
    () => {
      const rgba = parseColor(initialColor);
      return rgba
        ? rgbaToColorValue(rgba)
        : rgbaToColorValue({ r: 0, g: 0, b: 0, a: 1 });
    }
  );

  const controlledColorValue = useMemo(() => {
    if (!controlledColor) {
      return null;
    }
    const rgba = parseColor(controlledColor);
    return rgba ? rgbaToColorValue(rgba) : null;
  }, [controlledColor]);

  // INTERNAL HSVA REMEMBERS THE LAST STEERED HUE, KEEPING THE RING STABLE THROUGH GRAYS
  const hsva = useMemo(
    () =>
      controlledColorValue
        ? preserveHueAndSaturation(controlledColorValue.hsva, internalHsva)
        : internalHsva,
    [controlledColorValue, internalHsva]
  );

  const colorValue = controlledColorValue ?? internalColorValue;

  const isDragging = useRef(false);

  // LATEST COLOR FOR endDrag, WHICH MAY BE A STALE REFERENCE CAPTURED AT DRAG START
  const colorValueRef = useRef(colorValue);
  useEffect(() => {
    colorValueRef.current = colorValue;
  }, [colorValue]);

  const updateColor = useCallback(
    (newHsva: HSVA) => {
      const rgba = hsvaToRgba(newHsva);
      const newColorValue = rgbaToColorValue(rgba);
      // TRACKED EVEN WHILE CONTROLLED: THE HUE RING READS IT BACK FOR GRAYS
      setInternalHsva((prev) => preserveHueAndSaturation(newHsva, prev));
      if (!controlledColorValue) {
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
        setInternalHsva((prev) =>
          preserveHueAndSaturation(newColorValue.hsva, prev)
        );
        if (!controlledColorValue) {
          setInternalColorValue(newColorValue);
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
  };
}

export function usePointerDrag(
  onMove: (position: { x: number; y: number }) => void,
  onStart?: () => void,
  onEnd?: () => void,
  externalRef?: RefObject<HTMLDivElement | null>
) {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = externalRef || internalRef;
  const isDragging = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // LATEST CALLBACKS IN REFS SO DOCUMENT LISTENERS NEVER CALL STALE CLOSURES
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onMoveRef.current = onMove;
    onEndRef.current = onEnd;
  });

  const getPosition = useCallback(
    (e: PointerEvent | ReactPointerEvent) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      // THUMBS STAY INSIDE THE ELEMENT, SO 0..1 SPANS THE INSET RANGE
      const inset =
        parseFloat(
          window.getComputedStyle(el).getPropertyValue('--ck-thumb-inset')
        ) || 0;
      const axis = (offset: number, size: number) =>
        size > inset * 2
          ? clamp((offset - inset) / (size - inset * 2), 0, 1)
          : clamp(offset / size, 0, 1);
      return {
        x: axis(e.clientX - rect.left, rect.width),
        y: axis(e.clientY - rect.top, rect.height),
      };
    },
    [containerRef]
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
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
        document.removeEventListener('pointercancel', handlePointerUp);
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
      // A CANCELLED DRAG (GESTURE TAKEOVER, PALM REJECTION) MUST END THE DRAG TOO
      document.addEventListener('pointercancel', handlePointerUp);
    },
    [getPosition, onStart]
  );

  useEffect(() => () => cleanupRef.current?.(), []);

  return {
    containerRef,
    handlePointerDown,
  };
}

/** @deprecated Will be removed in a future minor release. Debounce in your app instead. */
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
