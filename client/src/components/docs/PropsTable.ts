import type { ReactNode } from 'react';

// Shared row shape for the docs reference tables (rendered by PropsTable.astro).
export interface PropRow {
  name: string;
  /** Type signature, or (for CSS variables) the default value. */
  type?: string;
  default?: string;
  required?: boolean;
  description: ReactNode;
}
