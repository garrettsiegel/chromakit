import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

export default {
  darkMode: ['class'],
  content: ['./client/src/**/*.{astro,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: '.5625rem' /* 9px */,
        md: '.375rem' /* 6px */,
        sm: '.1875rem' /* 3px */,
      },
      colors: {
        // Flat / base colors (regular buttons)
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
          border: 'rgb(var(--card-border) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
          border: 'rgb(var(--popover-border) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          border: 'rgb(var(--primary) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
          border: 'rgb(var(--secondary) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
          border: 'rgb(var(--muted) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
          border: 'rgb(var(--accent) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
          border: 'rgb(var(--destructive) / <alpha-value>)',
        },
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config;
