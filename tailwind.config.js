/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffceb',
          100: '#fdf3c7',
          200: '#fbe48e',
          300: '#f8d04e',
          400: '#f6bf24',
          500: '#f4b00b',
          600: '#d98a06',
          700: '#b66608',
          800: '#944f0d',
          900: '#7a420e',
        },
        brand: '#f4b00b',
      },
      screens: {
        'xs': '400px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
