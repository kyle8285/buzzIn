app.controller('ScoreCtrl', function($scope, ScoreFactory) {
	$scope.scores = ScoreFactory;
})