// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    root: 'public',           // <— look in public/ for index.html
  publicDir: '../public',   // <— keep other static assets working
  plugins: [vue()],
  server: {
    proxy: {
      '/functions': {
        target: 'https://mbxccttqktcqrmqlzcva.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/functions/, ''),
      },
    },
    // ← Add this block:
    watch: {
      usePolling: true,
      // you can tweak interval if you like (default 100ms)
      interval: 100,
    },
  },
})
