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
		$scope.error = null;
	};
	$scope.toggleSignup = function(){
		$scope.signingUp = ! $scope.signingUp;
		$scope.loggingIn = false;
		$scope.error = null;
	};
});
