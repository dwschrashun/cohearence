app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController',
        resolve: {
        	theUser: function(AuthService) {
        		return AuthService.getLoggedInUser()
        	}
        }
    });
});
// console.log(app);
app.controller('HomeController', function($scope, AuthService, $state, theUser) {
	if(!theUser) $state.go('landing');
})
