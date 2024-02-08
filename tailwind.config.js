/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        signature: "#043f9d",
        secondary: "#6c757d",
        background: "#f3f3f4",
      },
      colors: {
        signature: "#043f9d",
      },
    },
  },
  plugins: [],
};
