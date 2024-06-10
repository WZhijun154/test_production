import { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    darkMode: 'class',
    extend: {
      backgroundImage: {
        tree: 'url(https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
        'gradient-white-trans':
          'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100px rgba(255, 255, 255, 1) 100%)',
        'custom-gradient':
          'repeating-linear-gradient(45deg, #444cf7, #444cf7 5px, #e5e5f7 5px, #e5e5f7 25px)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        lightning: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        animateIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        in: 'animateIn 0.3s ease 0.15s both',
        float: 'float 2s ease-in-out infinite',
      },
      transitionProperty: {
        bg: 'background-color',
      },
      clipPath: {
        inset: 'inset(0 0 0 0)',
      },
      fontSize: {
        '12px': '12px',
        '14px': '14px',
        '16px': '16px',
        '18px': '18px',
        '20px': '20px',
        '24px': '24px',
        '30px': '30px',
        '36px': '36px',
        '48px': '48px',
        '60px': '60px',
        '72px': '72px',
      },
      colors: {
        'main-100': 'hsl(198, 70%, 75%)',
        'main-200': 'hsl(200, 70%, 68%)',
        'main-300': 'hsl(204, 70%, 62%)',
        'main-400': 'hsl(208, 70%, 56%)',
        'main-500': 'hsl(212, 70%, 50%)',
        'main-600': 'hsl(216, 70%, 47%)',
        'main-700': 'hsl(220, 70%, 44%)',
        'main-800': 'hsl(224, 70%, 41%)',
        'main-900': 'hsl(229, 70%, 38%)',

        'cool-gray-100': 'hsl(212, 21%, 88%)',
        'cool-gray-200': 'hsl(212, 19%, 82%)',
        'cool-gray-300': 'hsl(212, 17%, 76%)',
        'cool-gray-400': 'hsl(212, 15%, 67%)',
        'cool-gray-500': 'hsl(212, 12%, 58%)',
        'cool-gray-600': 'hsl(212, 12%, 50%)',
        'cool-gray-700': 'hsl(212, 13%, 40%)',
        'cool-gray-800': 'hsl(212, 14%, 30%)',
        'cool-gray-900': 'hsl(212, 15%, 20%)',
      },
    },
  },
  variants: {
    extend: {
      clipPath: ['responsive'],
    },
  },
  plugins: [
    nextui({
      prefix: 'nextui', // prefix for themes variables
      addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: 'light', // default theme from the themes object
      defaultExtendTheme: 'light', // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        // light: {
        //   layout: {}, // light theme layout tokens
        //   colors: {}, // light theme colors
        // },
        // dark: {
        //   layout: {}, // dark theme layout tokens
        //   colors: {}, // dark theme colors
        // },
        // ... custom themes
      },
    }),
  ],
  darkMode: 'class',
};

export default config;
