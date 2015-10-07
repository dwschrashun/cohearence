app.directive('song', function(PlaylistFactory){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/song/song.html',
		scope: {
			song: '='
		},
		link: function(scope, elem, attrs) {
			console.log('THE SCOPE', scope);
			scope.addToPlaylist = function(playlist) {
				PlaylistFactory.addToPlaylist(scope.song, playlist);
			}
		}
	};
});

// app.controller('SongCtrl', function($scope, PlaylistFactory) {
// 	console.log('im a song controller');


// 	}
// });
