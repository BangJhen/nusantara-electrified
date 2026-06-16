import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#081D57",
          blue: "#1267D8",
          blue2: "#0B5ED7",
          orange: "#FF6B00",
          teal: "#12B6C8",
          green: "#2F8F46",
          bg: "#F3F7FD",
          surface: "#FFFFFF",
          soft: "#EAF3FF",
          border: "#D8E5F3",
          ink: "#0B174A",

          // Compatibility aliases for older components while the dashboard is rebuilt.
          dark: "#081D57",
          rust: "#FF6B00",
          forest: "#2F8F46",
          gold: "#F6B44B",
        },
      },
      fontFamily: {
        sans: ["Open Sans", "system-ui", "sans-serif"],
        heading: ["Oswald", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'card': '0 8px 24px rgba(8, 29, 87, 0.08)',
        'panel': '0 2px 10px rgba(8, 29, 87, 0.06)',
      }
    },
  },
  plugins: [],
};

export default config;
