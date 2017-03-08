const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
//const HtmlwebpackPlugin = require('html-webpack-plugin');
const ROOT_PATH = path.resolve(__dirname);

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


const config = {
  entry: [
    path.resolve(ROOT_PATH, 'src/index'),
  ],
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    publicPath: '/',
    filename: 'highcharts_date_range_grouping.js'
  },
  devServer: {
    contentBase: path.resolve(ROOT_PATH, 'build')
    //hot: true,
    //inline: true,
  },
  devtool: 'source-map',
  //plugins: [
    //new webpack.HotModuleReplacementPlugin()
    //new HtmlwebpackPlugin({
      //title: 'examples'
    //})
  //],
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
              ['es2015', { modules: false }]
            ]
          }
        }]
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader','css-loader','sass-loader']
      }
    ]
  }
}

module.exports = [config];
