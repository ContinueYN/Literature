import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// 纯前端离线应用：base 用相对路径，保证 file:// 与 Capacitor WebView 下均可加载
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'favicon.svg'],
      manifest: {
        name: '墨阅 · 现代文学离线阅读',
        short_name: '墨阅',
        description: '纯前端、离线可用、零联网的现代文学精品阅读应用',
        theme_color: '#1f1b16',
        background_color: '#f5f0e6',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  build: {
    target: 'es2018',
    chunkSizeWarningLimit: 1500
  }
});
