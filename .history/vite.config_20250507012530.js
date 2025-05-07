// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(),
    commonjs({
      defaultIsModuleExports: true,
      include: [/node_modules/],
    })
  ],
  resolve: {
    alias: {
      // your existing @ → src alias
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // force Vite to pull in the CJS entrypoint for fast-deep-equal
      'fast-deep-equal': 'fast-deep-equal/index.js',
    },
  },
  optimizeDeps: {
    // ensure Vite pre-bundles fast-deep-equal with esbuild
    include: ['fast-deep-equal'],
  },
  build: {
    commonjsOptions: {
      // treat it as CJS so Rollup will wrap a default export
      include: [
        /node_modules/,                      // everything in node_modules…
        /@supabase\/postgrest-js/,           // …postgrest-js CJS entry
        /@supabase\/supabase-js/,            // …supabase-js CJS bits
        /node_modules\/fast-deep-equal/,     // your original fast‑deep‑equal
      ],
      defaultIsModuleExports: true,
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
