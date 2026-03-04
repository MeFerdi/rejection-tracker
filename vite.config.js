// ─────────────────────────────────────────────
// vite.config.js — Vite + React + PWA
// Strategy: generateSW (Workbox manages the SW automatically)
// ─────────────────────────────────────────────

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // generateSW: Workbox auto-generates the service worker.
      // No need for a manual sw.js or self.__WB_MANIFEST placeholder.
      strategies: "generateSW",
      registerType: "prompt",
      injectRegister: "auto",

      // Precache all built assets
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

        // SPA fallback — serve index.html for all navigation
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],

        // Runtime caching for Google Fonts
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      // PWA manifest
      manifest: {
        name: "1000 Challenge — Job Hunt Tracker",
        short_name: "1000 ✕",
        description: "Track your 1000 job applications. Offline-first, installable.",
        start_url: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#F7F5F2",
        theme_color: "#111010",
        icons: [
          { src: "/icons/icon-72.png",  sizes: "72x72",   type: "image/png" },
          { src: "/icons/icon-96.png",  sizes: "96x96",   type: "image/png" },
          { src: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
        shortcuts: [
          {
            name: "Log Application",
            short_name: "Add",
            url: "/?view=add",
            icons: [{ src: "/icons/icon-96.png", sizes: "96x96" }],
          },
        ],
      },

      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["recharts"],
        },
      },
    },
  },
});