var path = require('path');
var http = require('http');
var socketio = require('socket.io');

var server = http.createServer();

var express = require('express');
var app = express();

var PORT = 3000;

server.on('request', app);
// be sure to place this below server.on so the express app takes precedence
// over the socket server for typical http requests
var io = socketio(server);

io.on('connection', function(socket) {
	console.log('a new client has connected');
	console.log(socket.id);
	socket.on('buttonPress', function(team) {
		io.emit('sendTeam', team)
	});

	socket.on('newRound', function() {
		io.emit('resetButtons');
	});
})


server.listen(PORT, function() {
	console.log('The server is running on port ' + PORT.toString())
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
})

