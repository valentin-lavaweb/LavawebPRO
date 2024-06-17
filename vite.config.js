import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [
    react(),
    glsl()
  ],
  worker: {
    format: 'es'
  },
  resolve: {
    alias: {
      'comlink': 'comlink/dist/esm/comlink.mjs'
    }
  }
})