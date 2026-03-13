// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C3CE1',
          50: '#F0EBFD',
          100: '#D9CCFA',
          500: '#6C3CE1',
          600: '#5A2EBF',
          900: '#1E0A5C',
        },
        secondary: {
          DEFAULT: '#F97316',
          500: '#F97316',
          600: '#EA6C0A',
        },
        dark: {
          DEFAULT: '#0F0A1E',
          800: '#1A1230',
          700: '#241A42',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
