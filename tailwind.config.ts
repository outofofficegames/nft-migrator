import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        russo: ['var(--font-russo)']
      }
    }
  },
  plugins: [require('@headlessui/tailwindcss')]
}
export default config
