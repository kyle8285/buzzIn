var app = angular.module('buzzIn', []);



app.controller('BuzzerCtrl', function($scope, socket, ScoreFactory) {
	$scope.entries = [];
	$scope.msg;
	$scope.player;
	$scope.players = 0;
	$scope.admin;
	$scope.buzzed = false;

	$scope.startGame = function() {
		$scope.admin = true;
	};

	$scope.joinGame = function() {
		if ($scope.players < 3) {	
			$scope.player = true;
			$scope.players++;
		}
		else {
			console.log('Sorry, the game is full!')
		}
	};

	$scope.newRound = function() {
		socket.emit('newRound');
		$scope.entries = [];
		$scope.buzzed = false;
		$scope.tooLate = false;
		$scope.$digest;
	}

	$scope.setSocketId = function(team) {
		socket.team = team;
		ScoreFactory[team] = 0;

		console.log(socket.team)
	};

	$scope.buttonPress = function() {
		var time = Date.now();
		if (!$scope.buzzed) {
			console.log('BUZZ');
			console.log(socket.team);
			socket.emit('buttonPress', socket.team);
		} else {
			console.log('Too slow!')
			$scope.tooLate = true;
		}
	};

	socket.on('connect', function() {
		console.log('Welcome to the game!');
	})

	socket.on('sendTeam', function(team) {
		$scope.entries.push(team);
		$scope.buzzed = true;
		$scope.$digest();
	})

	socket.on('resetButtons', function() {
		console.log('resetting round')
		$scope.entries = [];
		$scope.buzzed = false;
		$scope.tooLate = false;
		$scope.$digest();
	})


});



app.factory('socket', function() {
	var socket = io.connect('http://192.168.0.102:3000');
	return socket;
})
