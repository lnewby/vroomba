const Server = require('./server.js')
const port = (process.env.PORT || 8080)
const app = Server.app()

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('./webpack.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config[0].output.path
  }))
  app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
  })
}

var server1 = app.listen(port)
console.log(`Listening at http://localhost:${port}`)

const socket = require('socket.io');
var io = socket(server1);
io.origins('*:*');
io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('position', function(data) {
    //console.log(data);
    socket.broadcast.emit('position', data);
  });
  socket.on('camera', function(data) {
    //console.log(data);
    socket.broadcast.emit('camera', data);
  });
});
io.listen(3000);