module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0095F6',
        background: '#000000',
        lightgray: '#333333',
        text: '#FAFAFA',
        border: '#262626',
        danger: '#ED4956',
        card: '#1a1a1a'
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 