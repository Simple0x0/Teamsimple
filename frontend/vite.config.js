import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      `f242-2001-4278-11-44cd-1d90-1ad1-c7ee-ffca.ngrok-free.app`,
      'simple.local',
    ]
  },
   build: {
    sourcemap: false, // for production
    minify: 'esbuild',
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
  },
  esbuild: {
    sourcemap: false, // for dev (less common)
  }
})
