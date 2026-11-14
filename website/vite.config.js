import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base so the build works on GitHub Pages project URLs (/refine/) and custom domains alike
  base: './',
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
