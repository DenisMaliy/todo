const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  mode:'development',
  entry:{
    index:'./src/index.js'
  },
  module:{
    rules:[{
      test: /\.vue$/,
      loader: 'vue-loader'
      },
      {
        test:/\.js$/,
        loader:'babel-loader'
      },
      {
        test:/\.css$/,
        use:[
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:"./src/index.html"
    }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [{
        from: "public",
        globOptions: {
          ignore: [
            '**/public/cork-texture.jpg'
          ]
        }
      }],
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
}