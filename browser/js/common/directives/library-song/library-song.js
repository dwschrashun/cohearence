app.directive('librarySong', function(PlaylistFactory){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/library-song/library-song.html',
		scope: {
			song: '=',
			load: '=',
			index: '@',
			current: '=',
			next: '=',
			delete: '='
		},
		link: function(scope, elem, attrs) {
			scope.addToPlaylist = function(playlistId) {
				PlaylistFactory.addToPlaylist(scope.song._id, playlistId);
			};

		}
	};
});
