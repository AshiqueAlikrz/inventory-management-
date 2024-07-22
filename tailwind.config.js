/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Helvetica", "Arial", "sans-serif"],
      serif: ["ui-serif", "Georgia", "Times New Roman", "serif"],
      mono: ["ui-monospace", "SFMono-Regular", "Courier New", "monospace"],
      display: ["Oswald", "Roboto", "sans-serif"],
      body: ['"Open Sans"', "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
