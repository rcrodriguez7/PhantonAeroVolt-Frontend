import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html', // 🔥 Asegura que el punto de entrada sea correcto
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: './', // 🔥 Usa './' para evitar problemas con archivos estáticos
});