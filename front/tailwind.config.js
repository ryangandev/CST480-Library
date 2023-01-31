/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        '1/20': '5%',
        '19/20': '95%',
        '3/10': '30%',
      }
    },
    fontFamily:{
      'button':['Orbitron', 'bold'],
      'poppins': ['Poppins'], 
    }
  },
  plugins: [],
}
