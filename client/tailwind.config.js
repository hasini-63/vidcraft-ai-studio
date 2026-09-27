/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#090b10',
          900: '#0f121a',
          850: '#151924',
          800: '#1b202e',
          700: '#262d40',
          600: '#38425d',
          500: '#526084',
          400: '#8695b8',
          300: '#b2bed8',
          200: '#dae1f0',
          100: '#f0f4fc'
        },
        brand: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          pink: '#ec4899',
          amber: '#f59e0b',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
