// UNDERSCORE PREFIX KEEPS THIS OUT OF ASTRO ROUTING
export interface DocNavEntry {
  slug: string;
  title: string;
  description: string;
}

export const DOCS_NAV: DocNavEntry[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description:
      'Install chromakit-react, render your first color picker, and set it up in Next.js or Vite.',
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
      'useColorState and usePointerDrag, the hooks behind every ChromaKit control. Also covers the deprecated useDebounce.',
  },
  {
    slug: 'utilities',
    title: 'Color Utilities',
    description:
      'Conversion functions, WCAG contrast helpers, and color-harmony generators with a live converter.',
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
