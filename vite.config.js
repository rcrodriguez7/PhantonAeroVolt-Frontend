import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Asegura que se ejecute en el puerto correcto
  },
  build: {
    outDir: 'dist', // Debe coincidir con la configuración de Netlify
    rollupOptions: {
      input: {
        main: 'src/main.jsx',
      },
    },
  },
  resolve: {
    alias: {
      // Agrega una configuración para evitar errores de rutas en producción
      '@': '/src',
    },
  },
  base: '/', // 🔥 Asegura que Netlify use la base correcta
});