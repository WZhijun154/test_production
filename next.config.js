module.exports = {
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  },
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
};
