import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: "#00BFFF",
        secondary: "#E8E8E8",
      },
      fontFamily: {
        clash: ["var(--font-clash-display)"],
      },
    },
  },
  plugins: [],
};
export default config;
