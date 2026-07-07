// Single source of truth for docs sidebar order + per-page SEO meta.
// Underscore-prefixed so Astro excludes it from routing.
export interface DocNavEntry {
  slug: string;
  title: string;
  /** Used as the page's <title> suffix and meta description. */
  description: string;
}

export const DOCS_NAV: DocNavEntry[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description:
      'Install ChromaKit, wire up your first React color picker, and set it up in Next.js or Vite.',
  },
  {
    slug: 'color-picker',
    title: 'ColorPicker',
    description:
      'The full ColorPicker component: every prop, the ColorValue object, presets, and format control.',
  },
  {
    slug: 'components',
    title: 'Composable Components',
    description:
      'Build a custom picker from ColorArea, sliders, inputs, preview, and swatch primitives.',
  },
  {
    slug: 'hooks',
    title: 'Hooks',
    description:
      'useColorState, usePointerDrag, and useDebounce — the hooks that power ChromaKit.',
  },
  {
    slug: 'utilities',
    title: 'Color Utilities',
    description:
      'Conversion functions, contrast checkers, and color-harmony generators with a live converter.',
  },
  {
    slug: 'theming',
    title: 'Theming',
    description:
      'Reskin the ChromaKit picker by overriding its --ck-* CSS custom properties.',
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description:
      'Common ChromaKit issues, fixes, and the full list of exported TypeScript types.',
  },
];
