import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/kirrbrest-JSFE2025Q3/pair-em-up/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
