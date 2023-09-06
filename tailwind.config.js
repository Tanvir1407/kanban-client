/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        sm: "425px",

        md: "768px",

        lg: "992px",

        xl: "1200px",

        "2xl": "1400px",
      },
    },
  },
  plugins: [],
}