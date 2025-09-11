import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import prerender from 'vite-plugin-prerender'
import { fetchContentRoutes } from './prerender-routes.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerender({
      staticDir: 'build',
      routes: await fetchContentRoutes(),
      rendererOptions: {
        headless: true,
        renderAfterDocumentEvent: 'render-event',
        renderAfterTime: 5000,
        maxConcurrentRoutes: 4,
        timeout: 10000,
        injectProperty: '__PRERENDER_INJECTED',
        inject: {
          prerendered: true,
          currentRoute: '/'
        }
      },
      postProcess: (renderedRoute) => {
        // Add meta tags for SEO
        renderedRoute.html = renderedRoute.html
          .replace('</head>', `
            <meta name="generator" content="Team Simple" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
            </head>
          `);
        return renderedRoute;
      }
    }),
  ],
  server: {
    allowedHosts: [
      `teamsimple.net`,
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
