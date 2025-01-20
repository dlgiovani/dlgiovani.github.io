/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        showUp: 'showUp .2s linear forwards',
      },
      keyframes: {
        showUp: {
          '0%': { opacity: 0, filter: 'blur(5px)' },
          '100%': { opacity: 1, filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
        "lily": {
          "primary": "#6c00ff",
          "primary-content": "#dbd9ff",
          "secondary": "#8000ff",
          "secondary-content": "#e1d9ff",
          "accent": "#4700a8",
          "accent-content": "#d4d2f1",
          "neutral": "#400080",
          "neutral-content": "#d4cee8",
          "base-100": "#1a1a2e",
          "base-200": "#151527",
          "base-300": "#10101f",
          "base-content": "#cbccd1",
          "info": "#6c00ff",
          "info-content": "#dbd9ff",
          "success": "#4caf85",
          "success-content": "#020b06",
          "warning": "#d19a66",
          "warning-content": "#100903",
          "error": "#d98080",
          "error-content": "#110606",

          "rounded-box": "1rem",
          "rounded-btn": "0.5rem",
          "rounded-badge": "1.9rem",
        }
      }
    ],
  },

}
