import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Fallback to index.html for SPA client-side routing
    fs: {
      strict: false,
    },
  },
  // For production builds, create a _redirects file or configure your server
  // to serve index.html for all routes
})
