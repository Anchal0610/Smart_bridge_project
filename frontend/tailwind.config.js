/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00f2fe",
        secondary: "#4facfe",
        accent: "#f093fb",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
