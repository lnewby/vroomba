const path = require('path')
const express = require('express')
var cors = require('cors'); 

module.exports = {
  app: function () {
    const app = express()
    const indexPath = path.join(__dirname, '/dist/index.html')
    const publicPath = express.static(path.join(__dirname, '/dist'))
    app.use(cors());
    app.use('/', publicPath)
    app.get('/', function (_, res) { res.sendFile(indexPath) })

    return app
  }
}
