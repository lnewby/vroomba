# SocketIO System

## Installation
```
npm install socket.io
```
```
npm install express
```
## Include
- socket.io.js
- server.js
## IP Address
HTML IP address
```
var socket = io.connect('http://xxx.xxx.xxx.xxx:3000');
```
Swift IP address
```
let manager = SocketManager(socketURL: URL(string: "xxx.xxx.xxx.xxx:3000")!, config: [.log(true), .compress])
```
## Ports
Server port
```
const server = app.listen(8080);
```
Client port
```
io.listen(3000);
```
 No newline at end of file
