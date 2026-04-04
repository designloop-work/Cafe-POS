/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f97316",
          dark: "#ea580c",
          light: "#fb923c",
        },
        surface: {
          DEFAULT: "#0f1117",
          1: "#161b27",
          2: "#1c2333",
          3: "#232d42",
          border: "#2a3347",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        "gradient-dark": "linear-gradient(135deg, #161b27 0%, #0f1117 100%)",
        "gradient-card": "linear-gradient(135deg, #1c2333 0%, #161b27 100%)",
        "gradient-glow": "radial-gradient(ellipse at top, #f9731620 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-brand": "0 0 20px rgba(249,115,22,0.3)",
        "glow-sm": "0 0 10px rgba(249,115,22,0.2)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
        "bounce-sm": "bounceSm 0.6s ease-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideInRight: { from: { opacity: 0, transform: "translateX(16px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        bounceSm: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.08)" } },
      },
    },
  },
  plugins: [],
}
