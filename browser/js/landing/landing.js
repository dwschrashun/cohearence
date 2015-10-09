app.config(function($stateProvider) {
	$stateProvider.state('landing', {
		url: '/landing',
		templateUrl: 'js/landing/landing.html',
		controller: 'LandingController'
	});
});

app.controller('LandingController', function($scope) {
	$scope.toggleLogin = function(){
		$scope.loggingIn = ! $scope.loggingIn;
		$scope.signingUp = false;
		console.log('logging in?', $scope.loggingIn);
	};
	$scope.toggleSignup = function(){
		$scope.signingUp = ! $scope.signingUp;
		$scope.loggingIn = false;
		console.log('signing up?', $scope.signingUp);
	};
});
