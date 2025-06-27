/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '58': '8.5rem', 
                       // 1rem = 16px, so 14.5rem = 232px
      },
    },
  },
  plugins: [],
}