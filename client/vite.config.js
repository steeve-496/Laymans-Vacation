import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
    proxy: {
      '/api': {
        target: 'https://laymans-vacation-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      'three': 'three'
    },
    dedupe: ['three'] // Force single instance
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap', '@gsap/react'],
          'ui-vendor': ['@studio-freight/lenis']
        }
      }
    }
  }
})
