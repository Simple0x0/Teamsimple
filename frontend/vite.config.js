import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
import { fetchContentRoutes } from './prerender-routes.js'

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      vitePrerenderPlugin({
        staticDir: 'build',
        entryPath: 'src/prerender.js',
        routes: await fetchContentRoutes(),
        rendererOptions: {
          renderAfterDocumentEvent: 'render-event', // wait until you dispatch this event
        },
        postProcess: (renderedRoute) => {
          // Inject global meta tags into every page
          renderedRoute.html = renderedRoute.html.replace(
            '</head>',
            `
              <meta name="generator" content="Team Simple" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
            </head>`
          )
          return renderedRoute
        },
      }),
    ],
    server: {
      allowedHosts: [
        'teamsimple.net',
      ],
    },
    build: {
      sourcemap: false, // disable sourcemaps for production
      minify: 'esbuild',
      outDir: 'build',
      chunkSizeWarningLimit: 5000,
    },
    esbuild: {
      sourcemap: false, // keep dev lean
    },
  }
})
