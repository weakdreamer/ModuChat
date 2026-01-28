/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#111827',
        surface: '#1F2937',
        accent: '#8B5CF6',
      },
      opacity: {
        '15': '0.15',
        '85': '0.85',
      },
    },
  },
  plugins: [],
}
