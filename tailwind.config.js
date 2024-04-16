/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fcefef",
        secondary: "#353535",
        danger: "#ff5f5f",
      },
    },
  },
  plugins: [],
};
