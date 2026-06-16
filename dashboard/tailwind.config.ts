import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // New clean indigo-violet palette
          navy:    "#1e1b4b",   // deep indigo
          blue:    "#4f46e5",   // primary indigo
          blue2:   "#6366f1",   // lighter indigo
          violet:  "#7c3aed",   // violet accent
          sky:     "#0ea5e9",   // sky blue
          teal:    "#14b8a6",   // teal
          green:   "#10b981",   // emerald
          amber:   "#f59e0b",   // amber
          rose:    "#f43f5e",   // rose
          orange:  "#f97316",   // orange
          gray:    "#6b7280",   // neutral gray
          bg:      "#F8F9FE",   // page background
          surface: "#FFFFFF",
          soft:    "#EEF0FD",   // indigo-tinted soft
          border:  "#E8EAFB",   // indigo-tinted border
          ink:     "#1e1b4b",

          // Legacy aliases
          dark:    "#1e1b4b",
          rust:    "#f97316",
          forest:  "#10b981",
          gold:    "#f59e0b",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:  "0 8px 32px rgba(79, 70, 229, 0.10)",
        panel: "0 2px 12px rgba(79, 70, 229, 0.06)",
        glow:  "0 0 20px rgba(79, 70, 229, 0.18)",
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
