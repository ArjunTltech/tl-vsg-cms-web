/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import animations from '@midudev/tailwind-animations'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['sans-serif','Poppins',]
      },
    },
  },
  plugins: [daisyui, animations],
  daisyui: {
    themes: [
      {
        "light": {
          "primary": "#3E3C73", //violet
          "base-300": "#DCE3EB",
          "base-200": "#FFFFFF",
          "base-100": "#F1F3F4",
          "stroke": "#DCDCDD",
          "secondary": "#5DAAEE",
          "accent": "#5395cf",
          "warning": "#FFC565",
          "info": "#5DAAEE",
          "error": "C71026",
          "success": "#0B8A00",
          "neutral" : "#E3E3E3",
          "neutral-content": "#0D0F11",


        },
        "dark": {
          "primary": "#3E3C73", //violet
          "base-100": "#262C36",
          "base-200": "#191D23",
          "base-300": "#0D0F11",
          "stroke": "#576776",
          "secondary": "#47A785",
          "accent": "#5395cf",
          "warning": "#EFB047",
          "info": "#5DAAEE",
          "error": "F53B30",
          "success": "#2AA31F",
          "neutral" : "#2B2E48",
          "neutral-content": "#F1F3F4",
        }
      }

    ],
  },
}

