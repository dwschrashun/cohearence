app.directive('song', function(PlaylistFactory){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/song/song.html',
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

// app.controller('SongCtrl', function($scope, PlaylistFactory) {
// 	console.log('im a song controller');


// 	}
// });
