import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: process.env.BUILD_PATH || 'dist', // Default to 'dist' if BUILD_PATH is not set
  },
})
