const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  plugins: [
  ],
  devServer: {
      clientLogLevel: 'warning',
      contentBase: false,
      compress: true,
      host: "0.0.0.0",
      port: 8000,
      open: true,
      inline: true, 
  }
})
