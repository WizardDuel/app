var path = require('path');

module.exports = {
  entry: {
    app: ['./www/app.js']
  },
  output: {
    path: path.resolve(__dirname, 'www/build'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
    devtool: 'source-map',
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
    sassLoader: {
        includePaths: ['./scss/content', './scss/core', './scss/includes', './scss/layout', './scss/mobile', './scss/general']
    }
};