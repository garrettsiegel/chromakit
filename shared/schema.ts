// ChromaKit Demo Site Schema
// Currently minimal as this is primarily a static demo site

import { z } from "zod";

// Color format validation schemas
export const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
export const hex8ColorSchema = z.string().regex(/^#[0-9A-Fa-f]{8}$/);

export const rgbSchema = z.object({
  r: z.number().min(0).max(255),
  g: z.number().min(0).max(255),
  b: z.number().min(0).max(255),
});

export const rgbaSchema = rgbSchema.extend({
  a: z.number().min(0).max(1),
});

export const hslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

export const hslaSchema = hslSchema.extend({
  a: z.number().min(0).max(1),
});

export const oklchSchema = z.object({
  L: z.number().min(0).max(1),
  C: z.number().min(0).max(0.5),
  h: z.number().min(0).max(360),
});

export const oklchaSchema = oklchSchema.extend({
  a: z.number().min(0).max(1),
});

// Type exports
export type RGB = z.infer<typeof rgbSchema>;
export type RGBA = z.infer<typeof rgbaSchema>;
export type HSL = z.infer<typeof hslSchema>;
export type HSLA = z.infer<typeof hslaSchema>;
export type OKLCH = z.infer<typeof oklchSchema>;
export type OKLCHA = z.infer<typeof oklchaSchema>;
