app.factory('socket', function() {
	var socket = io.connect('http://192.168.0.102:3000');
	console.log('socket connected, welcome to the game')
	return socket;
})