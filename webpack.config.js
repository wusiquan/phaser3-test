// 做个魔力省魔工具
const webpack = require('webpack')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

module.exports = {
  mode: 'development',

  devtool: 'cheap-source-map',

  entry: {
    playplay: './src/playplay/index.js',
    tilemap1: './src/tilemap1/index.js'
  },
  
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    publicPath: '/'
  },
  
  // devServer: {
  //   // contentBase: path.join(__dirname, 'dist'),
  //   // hotOnly: true,
  //   port: 8080,
  //   inline: true,
  //   historyApiFallback: {
  //     disableDotRule: true,
  //     rewrites: [
  //       { from: /^\/tilemap1.html/, to: '/dist/tilemap1.html' },
  //     ]
  //   }
  // },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: ['node_modules']
      },
      // {
      //   test: /\.scss$/,
      //   use: ['style-loader', 'css-loader', 'sass-loader'],
      //   include: path.resolve(__dirname, 'src/scss')
      //   // use: ExtractTextPlugin.extract({
      //   //   //fallback: 'style-loader',
      //   //   use: ['css-loader', 'sass-loader']
      //   // }),
      // }
    ]
  },

  optimization: {
    // ??
		splitChunks: {
      chunks: "all",
      name: false
    },
    runtimeChunk: true
	},

  plugins: [
    // new CopyWebpackPlugin([
    //   { from: './assets', to: 'assets' }
    // ]),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['playplay'],
      filename: 'playplay.html',
      template: 'src/playplay/index.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['tilemap1'],
      filename: 'tilemap1.html',
      template: 'src/tilemap1/index.html'
    })
  ]
}