/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '0',
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
      },
    },
    screens: {
      xs: { max: '480px' },
      sm: { max: '600px' },
      md: { max: '768px' },
      lg: { max: '1024px' },
      xl: { max: '1280px' },
      '2xl': { max: '1536px' },
      '3xl': { max: '2056px' },
      '-xs': { min: '480px' },
      '-sm': { min: '600px' },
      '-md': { min: '768px' },
      '-lg': { min: '1024px' },
      '-xl': { min: '1280px' },
      '-2xl': { min: '1536px' },
      '-3xl': { min: '2056px' },

      'h-700': { raw: '(max-height: 700px)' },
      'h-600': { raw: '(max-height: 600px)' },
    },
    extend: {
      fontFamily: {
        vinila: ['var(--font-vinila)', 'sans-serif'],
        primary: ['var(--font-primary)', 'sans-serif'],
      },
      screens: {
        'max-1232': { max: '1232px' },
      },
      colors: {
        neutral: '#fff9f9',
        neutralDark: '#1a1919',
        vermelho: '#ff3116',
        verde: '#0cc143',
        loader: '#d0ff0b',
      },
      animation: {
        breathe: 'breathe 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
        },
      },
      boxShadow: {
        custom: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
      },
    },
  },
  variants: {
    extend: {
      animation: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [],
};
