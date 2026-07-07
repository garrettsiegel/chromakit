import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export interface DocEntry {
  slug: string;
  title: string;
  Component: LazyExoticComponent<ComponentType>;
}

// Registry: single source of truth for docs routes + sidebar order.
export const DOCS: DocEntry[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    Component: lazy(() => import('./GettingStartedDoc')),
  },
  {
    slug: 'color-picker',
    title: 'ColorPicker',
    Component: lazy(() => import('./ColorPickerDoc')),
  },
  {
    slug: 'components',
    title: 'Composable Components',
    Component: lazy(() => import('./ComponentsDoc')),
  },
  {
    slug: 'hooks',
    title: 'Hooks',
    Component: lazy(() => import('./HooksDoc')),
  },
  {
    slug: 'utilities',
    title: 'Color Utilities',
    Component: lazy(() => import('./UtilitiesDoc')),
  },
  {
    slug: 'theming',
    title: 'Theming',
    Component: lazy(() => import('./ThemingDoc')),
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    Component: lazy(() => import('./TroubleshootingDoc')),
  },
];

export const DEFAULT_DOC_SLUG = 'getting-started';
