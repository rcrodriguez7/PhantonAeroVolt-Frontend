import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

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

// 🔥 Copia _redirects a dist/ si existe
const redirectsPath = 'public/_redirects';
if (fs.existsSync(redirectsPath)) {
  fs.copyFileSync(redirectsPath, 'dist/_redirects');
}
