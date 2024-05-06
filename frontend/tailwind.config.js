/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'vt323': ['VT323', 'monospace'],
        // Agregar la fuente VT323 como una fuente personalizada
        // Puedes agregar otras fuentes y sus respectivos fallbacks aquí
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}