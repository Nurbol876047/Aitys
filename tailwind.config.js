/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fbf7ed",
          100: "#f3ead2",
          300: "#d9bd82",
          500: "#b98a45",
        },
        aral: {
          blue: "#0f83bd",
          deep: "#0f3d4f",
          green: "#1f5b45",
          leaf: "#5d8a4b",
          alert: "#c94c3d",
        },
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 61, 79, 0.16)",
        insetBlue: "inset 0 0 50px rgba(15, 131, 189, 0.32)",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
