import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        casa: {
          cream:      '#F5F0E6',
          'cream-deep': '#EDE7D2',
          dark:       '#241C0E',
          mid:        '#7A6848',
          light:      '#9A8870',
          muted:      '#C4B898',
          border:     '#C8BD9A',
          gold:       '#A88030',
          'gold-light': '#F0E8CC',
          'gold-dark':  '#8A6820',
          night:      '#170F06',
          'night-mid':  '#2A1A08',
        },
      },
      fontFamily: {
        // Playfair Display – per titoli ed emozione
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // Lora – per testo del corpo
        body:  ['Lora', 'Georgia', 'serif'],
        // Inter – solo per UI di servizio (etichette, badge)
        ui:    ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(48px,12vw,66px)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        'title':   ['clamp(28px,7vw,36px)',  { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        'h2':      ['24px', { lineHeight: '1.15' }],
        'h3':      ['20px', { lineHeight: '1.2'  }],
        'body':    ['16px', { lineHeight: '1.75' }],
        'small':   ['14px', { lineHeight: '1.8'  }],
        'caption': ['12px', { lineHeight: '1.6', letterSpacing: '0.06em' }],
        'label':   ['11px', { lineHeight: '1.4', letterSpacing: '0.1em'  }],
      },
      animation: {
        'breathe':       'breathe 10s ease-in-out infinite',
        'fade-up':       'fadeUp 1.4s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d1':    'fadeUp 1.4s cubic-bezier(0.4,0,0.2,1) 1.2s forwards',
        'fade-up-d2':    'fadeUp 1.4s cubic-bezier(0.4,0,0.2,1) 3.0s forwards',
        'fade-up-d3':    'fadeUp 1.4s cubic-bezier(0.4,0,0.2,1) 4.2s forwards',
        'fade-in':       'fadeIn 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in-d1':    'fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) 1.0s forwards',
        'fade-in-d2':    'fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) 1.8s forwards',
        'fade-in-d3':    'fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) 2.6s forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.65' },
          '50%':      { opacity: '1'    },
        },
      },
      boxShadow: {
        'warm-sm':  '0 2px 12px rgba(36,28,14,0.06)',
        'warm-md':  '0 4px 24px rgba(36,28,14,0.10)',
        'warm-lg':  '0 8px 40px rgba(36,28,14,0.12)',
      },
      borderRadius: {
        'button': '6px',
        'card':   '10px',
        'circle': '9999px',
      },
      maxWidth: {
        'casa': '430px',
      },
    },
  },
  plugins: [],
}

export default config
