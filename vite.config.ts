import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@router',
        replacement: resolve(__dirname, './src/@lib/router'),
      },
    ],
  },
  build: {
    rollupOptions: {
      input: {
        root: resolve(__dirname, 'index.html'),
        _: resolve(__dirname, '404.html'),
      },
    },
  },
});
