app.directive('sidebar', function() {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/sidebar/sidebar.html',
		controller: function ($scope, $state, $rootScope) {
			$scope.currentItem = "library";
			$scope.items = [
				"Library",
				"Playlists",
				"Stats",
				"Friends",
				"Chrome Extension"
			];
			$scope.setCurrentItem = function(item){
				$scope.currentItem = item;
				if (item == "Playlists") {
					$rootScope.showingPlaylists = !$rootScope.showingPlaylists;
					console.log("playlist view? ",$rootScope.showingPlaylists);
				}
				// else {
				// 	$rootScope.showingPlaylists = false;
				// }

				if (item == "Library") {
					console.log('going home');
					$state.go('home');
				}
				console.log($scope.currentItem);
			};
		}
	};
});
