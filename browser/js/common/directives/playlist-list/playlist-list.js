app.directive('playlistList', function(PlaylistFactory, $state) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/playlist-list/playlist-list.html',
		// link: function(scope, elem, attrs) {
		// 	//console.log(scope.playlists);
		// 	scope.namingPlaylist = false;
		// 	// console.log("current user: ",scope.theUser);
		// 	scope.namePlaylist = function() {
		// 		scope.namingPlaylist = true;
		// 	};
		// 	scope.makePlaylist = function(){
		// 		// console.log(scope.playlists);
		// 		if (scope.playlists.indexOf(scope.playlistName) > -1){
		// 			console.log('Playlist names must be unique yo');
		// 		} else {
		// 			PlaylistFactory.makePlaylist(scope.playlistName)
		// 			.then(function(playlist){
		// 				scope.playlists.push(playlist);
		// 				scope.namingPlaylist = false;
		// 			});
		// 		}
		// 	};
		// },
		controller: 'PlaylistListCtrl'
	};
});

app.controller('PlaylistListCtrl', function($scope, $state, PlaylistFactory){
	// $scope.namePlaylist = function() {
	// 	$scope.namingPlaylist = true;
	// };
	$scope.makePlaylist = function(){
			PlaylistFactory.makePlaylist($scope.playlistName)
			.then(function(playlist){
				$scope.playlists.push(playlist);
				$scope.playlistName = "";
			});
	};
});
