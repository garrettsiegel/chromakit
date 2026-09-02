import type { RGBA } from '../types';
import { clamp } from './math';
import { hslaToRgba } from './hsl';
import { hsvaToRgba } from './hsv';

/**
 * Resolve one numeric component that may be written as a number or a
 * percentage. `percentReference` is the value 100% stands for.
 */
export function component(
  value: string,
  isPercent: string,
  percentReference: number
): number {
  const n = parseFloat(value);
  return isPercent ? (n / 100) * percentReference : n;
}

/** Resolve an optional `/ alpha` component, defaulting to fully opaque. */
export function alphaComponent(value?: string, isPercent?: string): number {
  if (value === undefined) return 1;
  return clamp(component(value, isPercent ?? '', 1), 0, 1);
}

/** Hue in degrees, normalized to [0, 360). The `deg` suffix is stripped by the regex. */
export function hueComponent(value: string): number {
  return ((parseFloat(value) % 360) + 360) % 360;
}

// CSS Color 4 lets rgb()/hsl()/hsv() be comma- OR space-separated (never mixed
// in real CSS) with an optional alpha after `,` or `/`. Shared regex pieces:
const NUM = String.raw`(-?[\d.]+)`;
const PCT = String.raw`(%?)`;
const SEP = String.raw`(?:\s*,\s*|\s+)`;
const ALPHA = String.raw`(?:(?:\s*[,/]\s*)${NUM}${PCT})?`;
const HUE = String.raw`(-?[\d.]+)(?:deg)?`;
const FUNC_ARGS = String.raw`\s*\(\s*`;

const rgbRegex = new RegExp(
  `^rgba?${FUNC_ARGS}${NUM}${PCT}${SEP}${NUM}${PCT}${SEP}${NUM}${PCT}${ALPHA}\\s*\\)$`
);
const hslRegex = new RegExp(
  `^hsla?${FUNC_ARGS}${HUE}${SEP}${NUM}${PCT}${SEP}${NUM}${PCT}${ALPHA}\\s*\\)$`
);
const hsvRegex = new RegExp(
  `^hsva?${FUNC_ARGS}${HUE}${SEP}${NUM}${PCT}${SEP}${NUM}${PCT}${ALPHA}\\s*\\)$`
);

export function parseRgbFunction(input: string): RGBA | null {
  const match = input.match(rgbRegex);
  if (!match) return null;
  return {
    r: clamp(Math.round(component(match[1], match[2], 255)), 0, 255),
    g: clamp(Math.round(component(match[3], match[4], 255)), 0, 255),
    b: clamp(Math.round(component(match[5], match[6], 255)), 0, 255),
    a: alphaComponent(match[7], match[8]),
  };
}

export function parseHslFunction(input: string): RGBA | null {
  const match = input.match(hslRegex);
  if (!match) return null;
  return hslaToRgba({
    h: hueComponent(match[1]),
    s: clamp(component(match[2], match[3], 100), 0, 100),
    l: clamp(component(match[4], match[5], 100), 0, 100),
    a: alphaComponent(match[6], match[7]),
  });
}

/** `hsv()` is not a CSS function, but the library emits it, so it round-trips. */
export function parseHsvFunction(input: string): RGBA | null {
  const match = input.match(hsvRegex);
  if (!match) return null;
  return hsvaToRgba({
    h: hueComponent(match[1]),
    s: clamp(component(match[2], match[3], 100), 0, 100),
    v: clamp(component(match[4], match[5], 100), 0, 100),
    a: alphaComponent(match[6], match[7]),
  });
}
