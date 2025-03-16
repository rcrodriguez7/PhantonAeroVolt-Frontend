import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { copyFileSync } from 'fs';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
    emptyOutDir: true,
  },
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

copyFileSync('public/_redirects', 'dist/_redirects'); // 🔥 Esta línea copia el archivo
