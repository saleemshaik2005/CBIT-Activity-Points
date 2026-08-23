import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cbit: {
          green: '#385529',
          darkgreen: '#263b1c',
          lightgreen: '#eef5ec',
          gold: '#a16b15',
          goldlight: '#c58b2b',
          goldbg: '#fbf5eb',
          maroon: '#a71a1b',
          maroonlight: '#fdf2f2',
          slate: '#3b566e',
          slatelight: '#f0f4f8',
          border: '#e6ded3',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cbit': '0 2px 8px rgba(56, 85, 41, 0.08)',
        'cbit-lg': '0 10px 25px -5px rgba(56, 85, 41, 0.12), 0 8px 10px -6px rgba(56, 85, 41, 0.08)',
      }
    },
  },
  plugins: [],
} satisfies Config;
