/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcff",
          100: "#d8f6fb",
          200: "#b3edf7",
          300: "#79dcef",
          400: "#37c6e2",
          500: "#1aa9cd",
          600: "#1389ad",
          700: "#136f8c",
          800: "#175b72",
          900: "#194d60"
        },
        mint: "#5dd6c8",
        ice: "#f7fbff",
        slateglass: "#26465c",
        night: "#102433"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(24, 79, 108, 0.18)",
        glass: "0 20px 60px rgba(102, 163, 193, 0.20)"
      },
      fontFamily: {
        display: ["Bahnschrift", "Trebuchet MS", "Segoe UI", "sans-serif"],
        body: ["Aptos", "Segoe UI", "Tahoma", "sans-serif"]
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(63, 193, 214, 0.24), transparent 36%), radial-gradient(circle at bottom right, rgba(102, 163, 255, 0.20), transparent 34%)"
      }
    }
  },
  plugins: []
};
