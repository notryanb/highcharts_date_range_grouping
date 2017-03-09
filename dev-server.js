const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const path = require('path');
const ROOT_PATH = path.resolve(__dirname);

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  contentBase: path.resolve(ROOT_PATH, 'build'),
  hot: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

server.listen(8080, 'localhost', function() {});
