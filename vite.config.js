import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { global: 'globalThis' }, 
  base: '/', // Ensure correct routing when deployed
  server: {
    historyApiFallback: true,  // Handles client-side routing fallback
  },
  build: {
    outDir: 'dist',  // Ensure build output directory is 'dist'
  },
})
