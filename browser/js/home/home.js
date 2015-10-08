app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/:playlistID',
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
			},
			thePlaylist: function ($stateParams, PlaylistFactory) {
				if ($stateParams.playlistID) {
					return PlaylistFactory.getPopulatedPlaylist($stateParams.playlistID);
				}
				return null;
			}
        }
    });
});

app.controller('HomeController', function($scope, AuthService, $state, theUser, thePlaylists, thePlaylist, PlaylistFactory, $stateParams) {
	if(!theUser) $state.go('landing');
	$scope.theUser = theUser;
	$scope.playlists = thePlaylists;
	//console.log("ID", $stateParams.playlistID);
	//console.log("playlist:", thePlaylist);
	if (!thePlaylist) {
		$scope.view = $scope.theUser.musicLibrary;
		$scope.header = "My Library";
		$scope.playlistView = false;
	}
	else {
		$scope.view = thePlaylist;
		$scope.header = $scope.view.name;
		$scope.playlistView = true;
	}
	console.log("VIEEWW", $scope.view);
});
