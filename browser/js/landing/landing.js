app.config(function ($stateProvider) {
    $stateProvider.state('landing', {
        url: '/',
        templateUrl: 'js/landing/landing.html',
        controller: 'LandingController'
    });
});

app.controller('LandingController', function ($scope, AuthService, $state) {
    function redirectToLibrary() {
        var user = AuthService.getLoggedInUser()
		.then(function(user){
        	if (user) $state.go('home');
		});
    }
    redirectToLibrary();
    $scope.toggleLogin = function () {
        $scope.loggingIn = !$scope.loggingIn;
        $scope.signingUp = false;
    };
    $scope.toggleSignup = function () {
        $scope.signingUp = !$scope.signingUp;
        $scope.loggingIn = false;
    };

});
