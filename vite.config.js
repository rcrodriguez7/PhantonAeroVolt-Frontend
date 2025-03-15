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
      input: 'index.html',  // 🔥 Asegura que el index.html esté incluido
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/', // 🔥 Usa '/' en lugar de './' para evitar problemas con rutas en Netlify
});