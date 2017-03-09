const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ROOT_PATH = path.resolve(__dirname);
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

const entry = PRODUCTION
  ? [ path.resolve(ROOT_PATH, 'src/index') ]
  : [
      path.resolve(ROOT_PATH, 'src/index'),
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:8080'
    ];

const plugins = PRODUCTION
  ? [ new ExtractTextPlugin('css/styles.css') ]
  : [
      new ExtractTextPlugin('css/styles.css'),
      new webpack.HotModuleReplacementPlugin()
    ];

const config = {
  entry: entry,
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    publicPath: '/',
    filename: 'highcharts_date_range_grouping.js'
  },
  devtool: 'source-map',
  resolve: { extensions: ['.js'] },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: __dirname,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015']
            ]
          }
        }]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: plugins,
}

module.exports = config;
