const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, '..', 'client', 'scripts', 'Client.js'),
  watch: false,
  module: {
    rules: [
      {
        test: /\.scss$/,
        use:['style-loader','css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8000,
          name: '../client/img/[hash]-[name].[ext]'
        }
      }
  ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'THREE': 'three'
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'dist')
  }
};