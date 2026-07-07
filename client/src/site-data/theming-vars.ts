import type { PropRow } from '@/components/docs/PropsTable';

// CSS custom properties defined in lib/color-picker/chromakit.css.
// The "default" column shows the light-theme value.
export const themingVars: PropRow[] = [
  {
    name: '--ck-primary',
    default: '#6366f1',
    description: 'Accent color for thumbs, focus rings, active states.',
  },
  {
    name: '--ck-primary-glow',
    default: 'rgba(99,102,241,0.4)',
    description: 'Glow behind interactive elements.',
  },
  {
    name: '--ck-accent',
    default: '#8b5cf6',
    description: 'Secondary accent.',
  },
  {
    name: '--ck-bg',
    default: '#f8f9fa',
    description: 'Picker background.',
  },
  {
    name: '--ck-bg-secondary',
    default: 'rgba(248,249,250,0.5)',
    description: 'Inset / secondary surfaces.',
  },
  {
    name: '--ck-text',
    default: '#1a1a1a',
    description: 'Primary text.',
  },
  {
    name: '--ck-text-muted',
    default: '#64748b',
    description: 'Labels and secondary text.',
  },
  {
    name: '--ck-glass-bg',
    default: 'rgba(255,255,255,0.7)',
    description: 'Frosted panel fill.',
  },
  {
    name: '--ck-glass-border',
    default: 'rgba(255,255,255,0.3)',
    description: 'Frosted panel border.',
  },
  {
    name: '--ck-glass-shadow',
    default: '0 8px 32px …',
    description: 'Panel shadow.',
  },
  {
    name: '--ck-blur',
    default: 'blur(20px)',
    description: 'Backdrop blur amount.',
  },
  {
    name: '--ck-radius',
    default: '12px',
    description: 'Outer corner radius.',
  },
  {
    name: '--ck-radius-md',
    default: '8px',
    description: 'Medium corner radius.',
  },
  {
    name: '--ck-radius-sm',
    default: '6px',
    description: 'Small corner radius.',
  },
];
