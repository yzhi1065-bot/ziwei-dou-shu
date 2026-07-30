/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zhuque': '#B22222',
        'shiqing': '#2F4F4F',
        'zheshi': '#CC7722',
        'mibai': '#F5F0E1',
        'jinbo': '#D4A017',
        'mose': '#1A1A2E',
        'xuanzhi': '#F8F4E6',
      },
      fontFamily: {
        'song': ['"Noto Serif SC"', '"STSong"', '"SimSun"', 'serif'],
        'kai': ['"STKaiti"', '"KaiTi"', 'serif'],
      },
      backgroundImage: {
        'xuanzhi-pattern': "url('/bg-xuanzhi.png')",
      },
    },
  },
  plugins: [],
}
