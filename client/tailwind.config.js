/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors — stark red, black, white
        brand: {
          red: '#EF0000',
          'red-dark': '#CC0000',
          'red-light': '#1A0000',
          black: '#000000',
          white: '#FFFFFF',
          gray: '#888888',
        },
        // Neutral palette — high contrast terminal aesthetic
        neutral: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D0D0D0',
          300: '#A0A0A0',
          400: '#787878',
          500: '#555555',
          600: '#333333',
          700: '#222222',
          800: '#111111',
          900: '#000000',
        }
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        '2xl': '0.5rem',
        '3xl': '0.75rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 12px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
