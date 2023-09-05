/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      phone: "375px",
      // => @media (min-width: 375px) { ... }

      tablet: "640px",
      // => @media (min-width: 640px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      keyframes: {
        "slow-slide": {
          "0%": { transform: "translateX(-30%)" },
          "100%": { transform: "translateX(0)" },
        },
        "like-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
      animation: {
        "slow-slide": "slow-slide 0.3s ease-out",
        "pulse-slow": "pulse 1s infinite alternate",
        "bounce-slow": "bounce 0.6s infinite alternate",
        "like-pulse": "like-pulse 1s ease-in-out alternate",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
