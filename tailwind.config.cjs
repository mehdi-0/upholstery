/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0e2233',
          700: '#213a4d',
          500: '#2d4f66',
          300: '#5e8aa8',
          100: '#eef5f9',
          gold: '#e8b34f',
        }
      }
    },
    fontFamily: {
      sans: ['ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Ubuntu','Cantarell','Noto Sans','Helvetica Neue','Arial','sans-serif']
    }
  },
  plugins: [],
};
