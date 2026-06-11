/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1F24",
        ember: "#FF6A00",
        cloud: "#F5F6F7",
        line: "#DADDE1",
        navy: "#0B1437",
        signal: "#3D6DFF"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,31,36,.05), 0 8px 24px rgba(26,31,36,.06)",
        deck: "0 24px 64px rgba(11,20,55,.18)"
      }
    }
  },
  plugins: []
};
