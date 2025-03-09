/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      height: {
        "18px": "18px",
      },
      width: {
        "18px": "18px",
      },
      fontFamily: {
        sans: [
          "Mulish",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        museo: ["MuseoModerno", "cursive"],
      },
      maxWidth: {
        1200: "1216px",
        1344: "1344px",
      },
      colors: {
        gray: {
          0: "#F2F2F3",
          5: "#EAEAEB",
          10: "#D9DADD",
          40: "#BEC0C5",
          60: "#838791",
          80: "#50545E",
          100: "#202532",
        },
        primary: {
          5: "#F2F6F8",
          10: "#E5EDF0",
          20: "#CCDCE2",
          50: "#80A9B6",
          80: "#337589",
          100: "#00526C",
        },
        success: {
          5: "#D6F3E2",
          50: "#008556",
          100: "#086343",
        },
        warning: {
          5: "#FFE1BE",
          50: "#E86825",
          100: "#A64F21",
        },
        alert: {
          5: "#FFD6D7",
          50: "#DE1C22",
          100: "#9F1B1F",
        },
      },
    },
  },
  plugins: [],
};
