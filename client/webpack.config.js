var path = require('path');

module.exports = {
  entry: {
    app: ['../app.js']
  },
  output: {
    path: path.resolve(__dirname, 'www/build'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  }
};