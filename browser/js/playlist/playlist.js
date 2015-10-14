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

app.controller('PlaylistController', function($scope, SongFactory, AuthService, $state, theUser, thePlaylists, thePlaylist, PlaylistFactory, $stateParams) {
	if(!theUser) $state.go('landing');
	else {
		$scope.theUser = theUser;
		$scope.playlists = thePlaylists;
		$scope.view = thePlaylist;
		$scope.header = $scope.view.name;
		$scope.playlistView = true;
		$scope.hasSongs = $scope.view.songs.length ? true: false;

		if ($scope.hasSongs) {
			$scope.view.songs.forEach(function(song){
				SongFactory.setSourceIcons(song);
			})
			// setSourceIcons($scope.view.songs);
		}
	}


	$scope.removePlaylist = function(playlist){
		PlaylistFactory.deletePlaylist(playlist._id)
		.then(function(){
			$scope.playlists = _.without($scope.playlists, playlist);
			if (thePlaylist._id === playlist._id) {
				$state.go('home');
			}
		});
	};
	//removes a song from a playlist
	$scope.remove = function(song){
		var songs = $scope.view.songs;
		PlaylistFactory.removeFromPlaylist($scope.view._id, song._id)
		.then(function(){
			$scope.view.songs = _.without($scope.view.songs, $scope.view.songs[$scope.view.songs.indexOf(song)]);
			$scope.hasSongs = $scope.view.songs.length ? true: false;
		});
	};
});
