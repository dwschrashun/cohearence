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

app.controller('HomeController', function($scope, AuthService, $state, theUser, thePlaylists, PlaylistFactory) {
	if(!theUser) $state.go('landing');
	else {
		$scope.theUser = theUser;
		$scope.playlists = thePlaylists;
		$scope.view = $scope.theUser.musicLibrary;
		$scope.header = "My Library";
		$scope.playlistView = false;
	}
});
