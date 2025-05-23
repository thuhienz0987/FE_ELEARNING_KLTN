import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        // sans: ["Manrope", "sans-serif"],
      },

      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite', // 30s là thời gian chạy của marquee , vong lap chay
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shake: 'shake 0.6s ease-in-out',
      },
    },
    colors: {
      majorelleBlue: '#545AE8',
      majorelleBlue50: 'rgba(86, 91, 221, 0.5)',
      majorelleBlue20: 'rgba(86, 91, 221, 0.2)',
      majorelleBlue70: 'rgba(86, 91, 221, 0.7)',

      PaleViolet: '#B781FF',
      LavenderIndigo: '#8844FF',
      amber: '#f59e0b',
      lightSilver: '#d9d9d9',
      champagne: '#F0F2CB',
      Sunglow: '#FFCD29',
      teaGreen: '#C3FFCA',
      vividMalachite: '#13CD2F',
      pinkLace: '#F3DEEF',
      deepPink: '#FC1996',
      darkSilver: '#736C6C',
      cosmicCobalt: '#2F327D',
      chineseBlack: 'rgba(13, 15, 28, 0.1)',
      gray: '#BBBBBB',
      goGreen: '#14AE5C',
      white: '#ffffff',
      PinkLace: '#f3e0f7',
      TropicalViolet: '#D1AFE8',
      DarkPastelPurple: '#9F82CE',
      DarkBlueGray: '#63589F',
      black: '#000000',
      black50: 'rgba(0,0,0,0.5)',
      black70: 'rgba(0,0,0,0.7)',
      redPigment: '#FF2929',
      AntiFlashWhite: '#FAFDFC',
      seoulPurple: '#851291',
      seoulPurple20: 'rgba(133, 18, 145,0.2)',
      beautyGreen: '#66A586',
      beautyGreen20: 'rgba(102, 165, 134, 0.2)',
      // eerieBlack: "#18181B",
      eerieBlack: '#080f17',
      // eerieBlack2: "#0a121a",

      richBlack: '#070C2A',
      russianViolet: '#2D1E4A',
      persianIndigo: '#371D73',
      yankeesBlue: '#152A43',
      transparent: 'transparent',

      greenCrayola: '#10b981',
      blueberry: '#3b82f6',
      carminePink: '#ef4444',
    },
    backgroundImage: {
      'custom-gradient-dark': 'linear-gradient(to  right, #1E293B, #334155)',
      'custom-gradient-light': 'linear-gradient(to  right, #E5E7EB, #F3F4F6)',
      'custom-gradient-button-violet': 'linear-gradient(to left top, #545AE8,#8844FF, #B781FF)',
      // "custom-gradient-button-blue":
      //   "linear-gradient(to bottom,#545AE8, #2F327D)",

      'custom-gradient-button-blue':
        'linear-gradient(to left top , rgba(0, 0, 255, 0.2),rgba(0, 0, 255, 0.4), rgba(0, 0, 255, 0.6), rgba(0, 0, 255, 0.8))',

      'custom-gradient-button-red':
        'linear-gradient(to left top, #b91c1c ,#dc2626,#ef4444, #f87171)',
      'gradient-144': 'linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb)',
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
