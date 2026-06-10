import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1F24",        // grafito ejecutivo (texto, sidebar, charts)
        ember: "#FF6A00",      // naranja de marca (CTAs, alertas, activos)
        cloud: "#F5F6F7",      // fondo de página
        line: "#DADDE1",       // bordes, divisores
        navy: "#0B1437",       // midnight navy (dashboards dark)
        signal: "#3D6DFF"      // azul eléctrico (datos secundarios)
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,31,36,.05), 0 8px 24px rgba(26,31,36,.06)",
        deck: "0 24px 64px rgba(11,20,55,.18)"
      }
    }
  },
  plugins: []
};
export default config;
