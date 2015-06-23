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
var maxUsers = 6;
var users = 0;

io.on('connection', function(socket) {
	if (users >= maxUsers) {
		socket.emit('tooManyUsers');
		console.log('Sorry, the game is full');
		socket.disconnect();
		return;
	}
	users++;
	console.log(socket.id, ' has connected');
	console.log('There are currently ' + users + ' logged in');
	socket.on('buttonPress', function(team) {
		console.log('button pressed')
		io.emit('sendTeam', team)
	});

	socket.on('newRound', function() {
		io.emit('resetButtons');
	});

	socket.on('addToScoreboard', function(team) {
		io.emit('addingToScoreboard', team);
	})

	socket.on('addScoreChange', function(obj) {
		io.emit('scoreUpdateAdd', obj);
	})

	socket.on('removeScoreChange', function(obj) {
		io.emit('scoreUpdateRemove', obj)
	})

	socket.on('disconnect', function() {
		console.log(socket.id, 'has left')
		users--;
		console.log('There are currently ' + users + ' logged in')
	})
})


server.listen(PORT, function() {
	console.log('The server is running on port ' + PORT.toString())
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
})


