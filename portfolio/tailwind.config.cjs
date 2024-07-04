/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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
  plugins: [],
}
