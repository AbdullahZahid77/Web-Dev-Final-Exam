/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**", // Explicitly exclude node_modules
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
