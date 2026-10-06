/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "wine-dark": "#0D0809",
        "maroon-glow": "#5C061E",
        "wine-shadow": "#3B0212",
        "crimson-neon": "#E6003A",
        "rose-gold": "#D4AF37",
        parchment: "#F1E8DA",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        mono: ["SFMono-Regular", "Consolas", "monospace"],
        sans: ["Inter", "Arial", "sans-serif"],
      },
      boxShadow: { wine: "0 0 50px #5C061E55", laser: "0 0 18px #E6003A66" },
      backdropBlur: { wine: "16px" },
    },
  },
  plugins: [],
};
