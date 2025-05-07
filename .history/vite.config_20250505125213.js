// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // proxy frontend /functions/* → your Supabase Functions
      '/functions': {
        target: 'https://mbxccttqktcqrmqlzcva.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/functions/, ''),
      },
    },
  },
})
