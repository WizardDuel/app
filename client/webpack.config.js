var path = require('path');
var webpack = require('webpack');

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
    contentBase: './www/',
    publicPath: '/build/'
  },
  sassLoader: {
    includePaths: [
      './assets/scss', './assets/scss/mixins'
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
            // loader: 'style!css?sourceMap!sass?sourceMap'
            loader: 'style!css!sass'
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
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ]
        }
      ]
    },
};
