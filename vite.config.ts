import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Victor Mayowa - Web Developer Portfolio',
        short_name: 'VM Portfolio',
        description: 'Portfolio of Victor Mayowa, a creative web developer and designer.',
        theme_color: '#1a1e24',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-cdn-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^https:\/\/victormayowa\.vercel\.app\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries – rarely change, good for caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // GSAP – animation library, large but stable
          'gsap': ['gsap'],

          // Sanity – only used on certain pages
          'sanity': [
            '@sanity/client',
            '@sanity/image-url',
            '@portabletext/react',
            '@sanity/block-content-to-react'
          ],

          // Icons – used on every page, but small enough to be separate
          'icons': ['react-icons'],

          // Maplibre – ONLY used on Contact page (lazy‑loaded)
          // Kept separate so it doesn't load on Home/About
          'maplibre': ['maplibre-gl']
        }
      }
    },
    // Increase warning limit (optional)
    chunkSizeWarningLimit: 1000
  }
})