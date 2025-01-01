/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        nav: "#d9e4e6",
        footer: "#d9e4e6",
        footerText: "rgb(79, 79, 79)",
        imageBG :"#7bafa3",
        HomeText : "#08141f"
      }
    },
  },
  plugins: [],
}

