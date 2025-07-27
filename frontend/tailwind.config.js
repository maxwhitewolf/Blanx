module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0095F6',
        background: '#FAFAFA',
        lightgray: '#DBDBDB',
        text: '#262626',
        border: '#EFEFEF',
        danger: '#ED4956',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 