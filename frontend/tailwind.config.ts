import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#d32f2f",
          dark: "#b71c1c",
          light: "#ffebee",
        },
        pink: {
          bg: "#fdf0f0",
          border: "#f0d5d5",
        },
        gold: "#f5a623",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        vietnam: ["Be Vietnam Pro", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "14px",
      },
      boxShadow: {
        mita: "0 4px 20px rgba(211,47,47,.13)",
      },
    },
  },
  plugins: [],
};

export default config;
