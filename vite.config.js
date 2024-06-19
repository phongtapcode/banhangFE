import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  server: {
    proxy: {
      '/api':'https://banhangbe.onrender.com',
    },
  },
  plugins: [react()],
});