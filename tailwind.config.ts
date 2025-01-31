import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in-down": "fadeInDown 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "infinite-scroll": "infinite-scroll 40s linear infinite",
        "nav-underline": "navUnderline 0.3s ease-out"
      },
      keyframes: {
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        navUnderline: {
          "0%": { transform: "translateX(-50%) scaleX(0)" },
          "100%": { transform: "translateX(-50%) scaleX(1)" },
        }
      },
      transitionDuration: {
        DEFAULT: "200ms",
        '300': "300ms",
      },
      transitionProperty: {
        'height': "height",
        'max-height': "max-height",
        'shadow': "box-shadow",
        'transform': "transform",
        'opacity': "opacity",
      }
    },
  },
  plugins: [],
};

export default config;