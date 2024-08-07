const { join } = require('path');
const uiConfig = require('../../packages/ui/ui.config.js');
const filePath = join(__dirname, './src/**/*.{js,ts,jsx,tsx}');
const uiPath = join(__dirname, '../../packages/ui/src/**/*.{js,ts,jsx,tsx}');
const scrollbarPlugin = require('tailwind-scrollbar');

/** @type {import('tailwindcss').Config} */
module.exports = uiConfig({
  content: [filePath, uiPath],
  theme: {},
  plugins: [
    scrollbarPlugin({ nocompatible: true }),
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-min-thumb': {
          '&::-webkit-scrollbar-thumb': {
            minHeight: '32px',
          },
          '&::-webkit-scrollbar-thumb:vertical': {
            minHeight: '32px',
          },
        },
      };

      addUtilities(newUtilities);
    },
    require('@tailwindcss/container-queries'),
  ],
});
