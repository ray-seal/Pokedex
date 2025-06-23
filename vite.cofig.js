import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // optional, defaults to project root
  publicDir: 'public', // default is "public", override if needed
  build: {
    outDir: 'dist', // default output folder
    emptyOutDir: true,
  },
  server: {
    port: 5173, // or whatever you prefer
    open: true, // opens in browser on dev
  },
});
