// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // now @/foo → src/foo
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/functions': {
        target: 'https://mbxccttqktcqrmqlzcva.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/functions/, ''),
      },
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
})
