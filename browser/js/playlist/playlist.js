app.config(function ($stateProvider) {
    $stateProvider.state('playlist', {
        url: '/playlists/:playlistID',
        templateUrl: 'js/playlist/playlist.html',
        controller: 'PlaylistController',
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

app.controller('PlaylistController', function($scope, AuthService, $state, theUser, thePlaylists, thePlaylist, PlaylistFactory, $stateParams) {
	if(!theUser) $state.go('landing');
	else {
		$scope.theUser = theUser;
		$scope.playlists = thePlaylists;
		$scope.view = thePlaylist;
		$scope.header = $scope.view.name;
		$scope.playlistView = true;
	}

	$scope.removePlaylist = function(id){
		PlaylistFactory.deletePlaylist(id)
		.then(function(){
			$scope.playlists.splice($scope.playlists.indexOf(id));
			console.log(thePlaylist);
			if (thePlaylist._id === id) {
				$state.go('home');
			}
		});
	};
});
