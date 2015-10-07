app.directive('playlistList', function(PlaylistFactory) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/playlist-list/playlist-list.html',
		link: function(scope, elem, attrs) {
			console.log(scope.theUser);
		}
	}
})
