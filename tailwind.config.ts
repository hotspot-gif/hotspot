import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#21264e',
        background: '#fff7f2',
        accent: '#245bc1',
        green: '#08dc7d',
        peach: '#ffc8b2',
        yellow: '#ffd54f',
        cyan: '#00d7ff',
        purple: '#46286e',
        red: '#f04438',
        blue: '#006ae0',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
