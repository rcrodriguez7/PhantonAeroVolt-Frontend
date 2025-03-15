import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // No es necesario aquí, pero puedes añadir aliases si los necesitas
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Especifica explícitamente main.jsx como punto de entrada
      },
    },
  },
  css: {
    postcss: {
      // Asegura que PostCSS funcione correctamente con Vite
    },
  },
});