/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B4EBF',
        secondary: '#FFD700',
        'accent-red': '#FF0000',
        'text-dark': '#333333',
        'text-light': '#FFFFFF',
        gray: {
          900: '#1a1a1a',
          600: '#4B5563',
          300: '#D1D5DB',
          50: '#F9FAFB'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}