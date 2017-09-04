const path = require('path');
const nodeExternals = require('webpack-node-externals');

const serverConfig = {
  target: 'node',
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  externals: [nodeExternals()],
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
};

module.exports = [serverConfig];
