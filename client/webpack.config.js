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
    includePaths: [
      './assets/scss'
   ]
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
        },
        {
          test:/\.css$/,
          loader: 'style!css?sourceMap'
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&minetype=application/font-woff'
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader'
        }
      ]
    },
};