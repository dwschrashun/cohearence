app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController',
        resolve: {
        	theUser: function(AuthService) {
				return AuthService.getLoggedInUser()
				.then(function(user){
					return user;
				});
        	},
			thePlaylists: function(PlaylistFactory) {
				return PlaylistFactory.getPlaylists();
			}
        }
    });
});

app.controller('HomeController', function($scope, AuthService, $state, theUser, thePlaylists) {
	if(!theUser) $state.go('landing');
	$scope.theUser = theUser;
	$scope.playlists = thePlaylists;
});
