/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'geist-mono': ['GeistMono', 'monospace'],
        'geist': ['Geist', 'sans-serif'],
      },
      colors: {
        'text-primary': '#ffffff',
        'text-secondary': '#727171', 
        'text-muted': '#999999',
      }
    },
  },
  plugins: [],
}
