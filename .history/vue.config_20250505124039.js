// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      // proxy all /functions requests to your Supabase Edge Functions
      '/functions': {
        target: 'https://mbxccttqktcqrmqlzcva.supabase.co/functions/v1',
        changeOrigin: true,
        pathRewrite: { '^/functions': '' },
      },
    },
  },
}
