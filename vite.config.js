import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
  },

  build: {
    // ✅ Target modern browsers — smaller, faster output
    target: 'es2015',

    // ✅ Raise chunk warning limit (large pages like Dashboard3 are intentional)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // ✅ Manual chunks — split heavy vendor libraries into separate cached files
        // Users only re-download a chunk when THAT library changes, not the whole app
        manualChunks: {
          // React core — changes rarely, gets cached aggressively
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],

          // Framer Motion — heaviest library, isolated so other chunks stay small
          'vendor-motion': ['framer-motion'],

          // Icon library — large, rarely changes
          'vendor-icons': ['lucide-react'],

          // Image/PDF utilities — only needed in Dashboard for downloads
          'vendor-canvas': ['html2canvas', 'html-to-image', 'jspdf'],

          // QR code library
          'vendor-qr': ['react-qr-code'],
        },
      },
    },
  },
})
