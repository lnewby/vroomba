const path = require('path');

module.exports = [{
  entry: './src/vroomba.js',
  output: {
    filename: 'vroomba.min.js',
    path: path.resolve(__dirname, 'dist')
  }
},
{ 
  entry: './src/components/component.js',
  output: {
    filename: 'component.min.js',
    path: path.resolve(__dirname, 'dist')
  }
}
];