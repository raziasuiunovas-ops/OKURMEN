import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fecdc9',
          300: '#fdaaa4',
          400: '#fa7970',
          500: '#f15046',
          600: '#de2e23',
          700: '#bb2318',
          800: '#9b2117',
          900: '#81221a',
          950: '#460d08',
        },
        accent: {
          50: '#fef7ee',
          100: '#fdecd7',
          200: '#fad5ae',
          300: '#f7b87a',
          400: '#f39244',
          500: '#f07420',
          600: '#e15a16',
          700: '#bb4315',
          800: '#953619',
          900: '#782e17',
          950: '#41160b',
        },
      },
    },
  },
  plugins: [],
};

export default config;
