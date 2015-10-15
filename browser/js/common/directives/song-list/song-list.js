app.directive('songList', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/song-list/song-list.html',
		controller: function ($scope) {
			$scope.$on("getFirstSong", function (event, args) {
				//console.log("emitting song", $scope.view[0].song);
				$scope.$emit("sendFirstSong", $scope.view[0].song);
			});
		}
	};
});
