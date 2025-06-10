// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/',
  plugins: [
    vue()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    include: ['fast-deep-equal'],
  },

  build: {
    commonjsOptions: {
      // wrap CommonJS defaults for these packages
      include: [
        /node_modules/,
        /@supabase\/postgrest-js/,
        /@supabase\/supabase-js/,
        /fast-deep-equal/,
      ],
      defaultIsModuleExports: true,
    },
  },

  server: {
    proxy: {
      '/functions': {
        target: 'https://mbxccttqktcqrmqlzcva.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/functions/, ''),
      },
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    historyAPIFallback: true,
  },
})
