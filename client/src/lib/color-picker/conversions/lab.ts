import type { RGB, LAB, LCH } from '../types';
import { linearToSrgb } from './math';

// CSS Color 4 defines lab()/lch() against the D50 white point, so the pipeline
// is Lab -> XYZ(D50) -> linear sRGB -> sRGB. Constants and the transform matrix
// are taken from the specification's sample code.
const KAPPA = 24389 / 27;
const EPSILON = 216 / 24389;
const D50_WHITE: readonly [number, number, number] = [
  0.3457 / 0.3585,
  1,
  (1 - 0.3457 - 0.3585) / 0.3585,
];

function labToXyz(lab: LAB): [number, number, number] {
  const f1 = (lab.L + 16) / 116;
  const fx = lab.a / 500 + f1;
  const fz = f1 - lab.b / 200;

  const x =
    Math.pow(fx, 3) > EPSILON ? Math.pow(fx, 3) : (116 * fx - 16) / KAPPA;
  const y = lab.L > KAPPA * EPSILON ? Math.pow(f1, 3) : lab.L / KAPPA;
  const z =
    Math.pow(fz, 3) > EPSILON ? Math.pow(fz, 3) : (116 * fz - 16) / KAPPA;

  return [x * D50_WHITE[0], y * D50_WHITE[1], z * D50_WHITE[2]];
}

/** Convert a CIE Lab color (D50) to sRGB, clipping to the sRGB gamut. */
export function labToRgb(lab: LAB): RGB {
  const [x, y, z] = labToXyz(lab);

  const r =
    3.1341359569958707 * x - 1.6173863321612538 * y - 0.4906619460083532 * z;
  const g =
    -0.978795502912089 * x + 1.916140481053928 * y + 0.03341542127645017 * z;
  const b =
    0.07195537988411677 * x - 0.2289768264158322 * y + 1.4053851325241447 * z;

  return { r: linearToSrgb(r), g: linearToSrgb(g), b: linearToSrgb(b) };
}

/** Convert CIE LCH (D50) to CIE Lab. */
export function lchToLab(lch: LCH): LAB {
  const hRad = lch.h * (Math.PI / 180);
  return {
    L: lch.L,
    a: lch.C * Math.cos(hRad),
    b: lch.C * Math.sin(hRad),
  };
}

/** Convert a CIE LCH color (D50) to sRGB, clipping to the sRGB gamut. */
export function lchToRgb(lch: LCH): RGB {
  return labToRgb(lchToLab(lch));
}
