import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    colors: {
      majorelleBlue: "#545AE8",
      majorelleBlue50: "rgba(86, 91, 221, 0.5)",
      majorelleBlue20: "rgba(86, 91, 221, 0.2)",

      majorelleBlue70: "rgba(86, 91, 221, 0.7)",
      lightSilver: "#d9d9d9",
      champagne: "#F0F2CB",
      Sunglow: "#FFCD29",
      teaGreen: "#C3FFCA",
      vividMalachite: "#13CD2F",
      pinkLace: "#F3DEEF",
      deepPink: "#FC1996",
      darkSilver: "#736C6C",
      cosmicCobalt: "#2F327D",
      chineseBlack: "rgba(13, 15, 28, 0.1)",
      gray: "#BBBBBB",
      goGreen: "#14AE5C",
      white: "#ffffff",
      black: "#000000",
      black50: "rgba(0,0,0,0.5)",
      redPigment: "#FF2929",
      AntiFlashWhite: "#EFF1F4",
      seoulPurple: "#851291",
      seoulPurple20: "rgba(133, 18, 145,0.2)",
      beautyGreen: "#66A586",
      beautyGreen20: "rgba(102, 165, 134, 0.2)",
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
