app.config(function($stateProvider) {
	$stateProvider.state('landing', {
		url: '/landing',
		templateUrl: 'js/landing/landing.html',
		controller: 'LandingController'
	})
})

app.controller('LandingController', function($scope) {

})
