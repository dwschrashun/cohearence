app.directive('playlistSong', function(PlaylistFactory){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/playlist-song/playlist-song.html',
		scope: {
			song: '='
		},
		link: function(scope, elem, attrs) {
			scope.addToPlaylist = function(playlistId) {
				PlaylistFactory.addToPlaylist(scope.song._id, playlistId);
			};
		}
	};
});
