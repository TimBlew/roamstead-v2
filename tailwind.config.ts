import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      fontSize: {
        'display': ['var(--text-display)', { lineHeight: 'var(--text-display-lh)' }],
        'h1': ['var(--text-h1)', { lineHeight: 'var(--text-h1-lh)' }],
        'h2': ['var(--text-h2)', { lineHeight: 'var(--text-h2-lh)' }],
        'h3': ['var(--text-h3)', { lineHeight: 'var(--text-h3-lh)' }],
        'h4': ['var(--text-h4)', { lineHeight: 'var(--text-h4-lh)' }],
        'xl': ['var(--text-xl)', { lineHeight: 'var(--text-xl-lh)' }],
        'lg': ['var(--text-lg)', { lineHeight: 'var(--text-lg-lh)' }],
        'md': ['var(--text-md)', { lineHeight: 'var(--text-md-lh)' }],
        'sm': ['var(--text-sm)', { lineHeight: 'var(--text-sm-lh)' }],
        'xs': ['var(--text-xs)', { lineHeight: 'var(--text-xs-lh)' }],
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '7': 'var(--space-7)',
        '8': 'var(--space-8)',
        '9': 'var(--space-9)',
        '10': 'var(--space-10)',
      },
      borderRadius: {
        '1': 'var(--radius-1)',
        '2': 'var(--radius-2)',
        '3': 'var(--radius-3)',
        '4': 'var(--radius-4)',
      },
      colors: {
        bg: {
          canvas: 'var(--color-bg-canvas)',
          subtle: 'var(--color-bg-subtle)',
          surface: 'var(--color-bg-surface)',
          'surface-hover': 'var(--color-bg-surface-hover)',
          'second-surface': 'var(--color-bg-second-surface)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          default: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
          'dark-primary': 'var(--color-text-dark-primary)',
          'dark-secondary': 'var(--color-text-dark-secondary)',
          'dark-muted': 'var(--color-text-dark-muted)',
          'dark-disabled': 'var(--color-text-dark-disabled)',
        },
        brand: {
          subtle: 'var(--color-brand-subtle)',
          default: 'var(--color-brand-default)',
          hover: 'var(--color-brand-hover)',
          active: 'var(--color-brand-active)',
          text: 'var(--color-brand-text)',
        },
        button: {
          'primary-bg': 'var(--color-button-primary-bg)',
          'primary-text': 'var(--color-button-primary-text)',
          'primary-hover': 'var(--color-button-primary-hover)',
          'primary-active': 'var(--color-button-primary-active)',
          'secondary-bg': 'var(--color-button-secondary-bg)',
          'secondary-text': 'var(--color-button-secondary-text)',
          'secondary-hover': 'var(--color-button-secondary-hover)',
        },
      },
    },
  },
  plugins: [],
}

export default config
