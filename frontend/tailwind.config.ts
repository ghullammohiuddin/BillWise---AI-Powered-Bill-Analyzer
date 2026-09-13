import type { Config } from 'tailwindcss';

// Tokens transcribed from the Stitch export's billwise_design_system/DESIGN.md.
//
// Colors come from that file's PROSE section ("Roles & Semantic Guidance"),
// not its YAML frontmatter. The frontmatter's `colors` block appears to have
// dark-scheme role pairs (e.g. dark "container" + light "on-container") mapped
// onto a light `background`/`surface`, which reads as an export artifact
// rather than an intentional theme. The prose gives unambiguous, named hex
// values for a normal light scheme, so those are used directly below.
//
// Typography, radius, and spacing ARE taken from the YAML frontmatter — those
// values are self-consistent and match what's baked into the exported mockup
// HTML.

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B5351', // Deep Teal — brand, nav, key metrics, primary actions
          dark: '#083E3D', // Midnight Teal — hover state
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#00A896', // Vivid Teal — focus rings, secondary emphasis
          foreground: '#FFFFFF',
        },
        mint: {
          DEFAULT: '#2A9D8F', // Soft Mint — positive feedback (decreases)
          tint: '#2A9D8F1A',
        },
        alert: {
          DEFAULT: '#E76F51', // Coral — increases, slab breaches, warnings
          amber: '#F4A261',
          tint: '#E76F5114',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#475569',
        },
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        danger: '#BA1A1A', // true system/API errors — distinct from "increase" alert coral
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': [
          '40px',
          { lineHeight: '48px', fontWeight: '800', letterSpacing: '-0.02em' },
        ],
        'display-lg-mobile': [
          '30px',
          { lineHeight: '38px', fontWeight: '800', letterSpacing: '-0.02em' },
        ],
        'headline-lg': [
          '28px',
          { lineHeight: '36px', fontWeight: '700', letterSpacing: '-0.01em' },
        ],
        'headline-lg-mobile': [
          '24px',
          { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.01em' },
        ],
        'headline-md': [
          '20px',
          { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.005em' },
        ],
        'headline-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'metric-currency': [
          '32px',
          { lineHeight: '40px', fontWeight: '800', letterSpacing: '-0.02em' },
        ],
        'metric-currency-mobile': [
          '26px',
          { lineHeight: '34px', fontWeight: '800', letterSpacing: '-0.02em' },
        ],
        'metric-unit': [
          '14px',
          { lineHeight: '20px', fontWeight: '600', letterSpacing: '0.02em' },
        ],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-md': [
          '13px',
          { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.01em' },
        ],
        'label-sm': [
          '11px',
          { lineHeight: '14px', fontWeight: '600', letterSpacing: '0.04em' },
        ],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-sm': '1rem',
        margin: '2rem',
        'margin-sm': '1rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        hover:
          '0 10px 15px -3px rgba(11, 83, 81, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
