app.directive('sidebar', function() {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/sidebar/sidebar.html',
		controller: function ($scope, $state) {
			$scope.currentItem = "library";
			$scope.items = [
				"Library",
				"Playlists",
				"Stats",
				"Friends",
				"Settings"
			];
			$scope.setCurrentItem = function(item){
				$scope.currentItem = item;
				if (item == "Playlists") {
					$scope.showingPlaylists = !$scope.showingPlaylists;
					console.log($scope.showingPlaylists);
				} else {
					$scope.showingPlaylists = false;
				}

				if (item == "Library") {
					console.log('going home');
					$state.go('home');
				}
				console.log($scope.currentItem);
			};
		}
	};
});
