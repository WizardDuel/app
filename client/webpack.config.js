var path = require('path');
var webpack = require('webpack')

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
  plugins: [
      new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery"
     })
  ],
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
        },
        {
          test: /vendor\/.+\.(jsx|js)$/,
          loader: 'imports?jQuery=jquery,$=jquery,this=>window'
        }
      ]
    },
};
