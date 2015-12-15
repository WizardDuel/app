var path = require('path');

module.exports = {
  entry: {
    app: './www/app.js'
  },
  resolve: {
    nodeDirectories: ['node_modules']
  },
  output: {
    path: path.resolve(__dirname, './www/build'),
    filename: 'bundle.js',
    contentBase: './www/'
  },
  sassLoader: {
    includePaths: ['./scss/content', './scss/core', './scss/includes', './scss/layout', './scss/mobile', './scss/general']
  },
  module: {
    loaders: [
        {
            test: /\.html$/,
            loader: 'html'
        },
        {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!sass?sourceMap'
        }
      ]
    },
    // devtool: 'source-map',
    devServer: {
      contentBase: './build'
    }
};