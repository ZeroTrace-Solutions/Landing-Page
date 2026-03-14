/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Genos', '"Aref Ruqaa Ink"', 'Geist Variable', 'system-ui', 'sans-serif'],
        arabic: ['Zain', 'Genos', 'sans-serif'],
        logo: ['"Aref Ruqaa Ink"', 'serif']
      }
    }
  },
  plugins: []
};
