var app = angular.module('buzzIn', ['ui.router', 'ui.bootstrap']);


app.config(function($stateProvider, $locationProvider) {
	// this turns off hashbang urls. don't forget to include base tag in html head!
	$locationProvider.html5Mode(true);

	$stateProvider.state('home', {
		url: '/',
		templateUrl: './templates/home.html'
	});

	$stateProvider.state('newGame', {
		url: '/game',
		templateUrl: './templates/game.html'
	});

	$stateProvider.state('player', {
		url: '/player',
		templateUrl: './templates/player.html'
	})

});

app.controller('MainController', function($scope, $state, socket, SoundFactory, ScoreFactory) {
	console.log('main controller')
	$scope.entries = [];
	$scope.buzzed;
	$scope.scoreboard = false;
	$scope.score;
	// $scope.rate = 3;

	$scope.startGame = function() {
		// SoundFactory.themeSong.play().fadeOut(15000);
		$state.go('newGame');
	};

	$scope.joinGame = function() {
		$state.go('player');
	};

	$scope.setSocketId = function(team) {
		socket.team = team;
		$scope.teamName = team;
		socket.emit('addToScoreboard', team);
		ScoreFactory[team] = 0;
		console.log(ScoreFactory)
	};

	$scope.buttonPress = function() {
		// SoundFactory.buzzerSound.play();
		socket.emit('buttonPress', socket.team);
	};

	$scope.newRound = function() {
		socket.emit('newRound');
	}

	$scope.showScores = function() {
		$scope.scoreboard = $scope.scoreboard ? false : true;
	};

	$scope.addToScore = function(stars, entry) {
		socket.emit('addScoreChange', {stars: stars, entry: entry});
	}

	$scope.removeFromScore = function(stars, entry) {
		socket.emit('removeScoreChange', {stars: stars, entry: entry})
	}

	socket.on('scoreUpdateAdd', function(obj) {
		ScoreFactory[obj.entry] += obj.stars;
		$scope.$digest();
	})

	socket.on('scoreUpdateRemove', function(obj) {
		ScoreFactory[obj.entry] -= obj.stars;
		$scope.$digest();
	})

	socket.on('sendTeam', function(team) {
		$scope.entries.push(team);
		// if (!$scope.buzzed) SoundFactory.buzzerSound.play();
		$scope.buzzed = true;
		$scope.$digest();
	})

	socket.on('resetButtons', function() {
		console.log('resetting round')
		$scope.entries = [];
		$scope.buzzed = false;
		$scope.$digest();
	})

	socket.on('addingToScoreboard', function(team) {
		ScoreFactory[team] = 0;
		$scope.$digest();
	})

	socket.on('tooManyUsers', function() {
		$scope.tooManyUsers = true;
	})

})
// app.controller('BuzzerCtrl', function($scope, socket, ScoreFactory) {
// 	var buzzerSound = new Howl({
//   urls: ['FamilyFeud-Ring.mp3']
// 	});
// 	$scope.entries = [];
// 	$scope.msg;
// 	$scope.player;
// 	$scope.players = 0;
// 	$scope.admin;
// 	$scope.buzzed = false;


// 	$scope.joinGame = function() {
// 		if ($scope.players < 3) {	
// 			$scope.player = true;
// 			$scope.players++;
// 		}
// 		else {
// 			console.log('Sorry, the game is full!')
// 		}
// 	};

// 	$scope.newRound = function() {
// 		socket.emit('newRound');
// 		$scope.entries = [];
// 		$scope.buzzed = false;
// 		$scope.tooLate = false;
// 		$scope.$digest;
// 	}

// 	$scope.setSocketId = function(team) {
// 		socket.team = team;
// 		$scope.team = team;
// 		ScoreFactory[team] = 0;
// 		console.log(ScoreFactory)
// 	};

// 	$scope.buttonPress = function() {
// 		if (!$scope.buzzed) {
// 			buzzerSound.play();
// 			console.log('BUZZ');
// 			console.log(socket.team);
// 			socket.emit('buttonPress', socket.team);
// 		} else {
// 			console.log('Too slow!')
// 			$scope.tooLate = true;
// 		}
// 	};

// 	socket.on('connect', function() {
// 		console.log('Welcome to the game!');
// 	})

// 	socket.on('sendTeam', function(team) {
// 		$scope.entries.push(team);
// 		// $scope.buzzed = true;
// 		$scope.winnner = team;
// 		$scope.$digest();
// 	})

// 	socket.on('resetButtons', function() {
// 		console.log('resetting round')
// 		$scope.entries = [];
// 		$scope.buzzed = false;
// 		$scope.tooLate = false;
// 		$scope.$digest();
// 	})


// });
