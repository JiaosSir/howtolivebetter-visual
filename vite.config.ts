import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base keeps assets working both at the domain root (Qoder Sites)
  // and under the /howtolivebetter-visual/ subpath (GitHub Pages).
  base: './',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
