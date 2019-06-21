/*
var redis = require("redis");
var redisClient = redis.createClient(11724, '0.tcp.ngrok.io');
redisClient.on("connect", function () {
    console.log('connected');
});
*/

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res, next) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(__dirname + '/dist/index.html');
});

app.get('/getredisdata', function (req, res, next) {
	console.log("getting data");
    redisClient.brpop("vroomba", 10, function(error, result) {
		res.send(result);
    });
});

const server = app.listen(8080);
/*
const socket = require('socket.io');
var io = socket(server);

io.on('connection', function(socket) {
	console.group('a user connected:');
	console.log(socket.handshake);
	console.groupEnd();
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
*/
