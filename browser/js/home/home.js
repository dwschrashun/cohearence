app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController',
        resolve: {
        	theUser: function(AuthService) {
				return AuthService.getLoggedInUser()
				.then(function(user){
					console.log('user: ', user);
					return user;
				});
        	}
			// thePlaylists: function(PlaylistFactory) {
			// 	console.log('in here');
			// 	return PlaylistFactory.getPlaylists();
			// }
        }
    });
});

app.controller('HomeController', function($scope, AuthService, $state, theUser, PlaylistFactory) {
	console.log('in the home controller');
	if(!theUser) $state.go('landing');
	else {
		console.log(theUser);
		$scope.theUser = theUser;
		// $scope.playlists = thePlaylists;
		$scope.view = $scope.theUser.musicLibrary;
		$scope.header = "My Library";
		$scope.playlistView = false;
	}
	console.log("VIEEWW", $scope.view);
});
