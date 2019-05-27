const path = require('path');

module.exports = [{
  mode: 'development',
  entry: './src/vroomba.js',
  output: {
    filename: 'vroomba.min.js',
    path: path.resolve(__dirname, 'dist')
  }
}];