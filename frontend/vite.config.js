import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import prerender from 'vite-plugin-prerender'
import routes from './prerender-routes.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerender({
      staticDir: 'build', // where Vite outputs
      routes, // list of routes to prerender
      rendererOptions: {
        headless: true,
        renderAfterDocumentEvent: 'render-event', // wait for this event to be dispatched
      },
    }),
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
