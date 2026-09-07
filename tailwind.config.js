/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0e17",
        panel: "#101623",
        panel2: "#0d1220",
        border: "#1c2432",
        accent: "#f7941d",
        bull: "#22c55e",
        bear: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
