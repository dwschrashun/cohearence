app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController',
        resolve: {
        	theUser: function(AuthService) {
				return AuthService.getLoggedInUser()
				.then(function(user){
					return user;
				});
			}
		}
	});
});

app.controller('HomeController', function($rootScope, $scope, AuthService, $state, theUser, PlaylistFactory) {

	if(!theUser) $state.go('landing');
	else {
		PlaylistFactory.getPlaylists()
		.then(function(playlists){
			$scope.hasSongs = false;
			$scope.theUser = theUser;
			$scope.playlists = playlists;
			$scope.view = $scope.theUser.musicLibrary;
			$rootScope.nextSong = $scope.view[0]._id || null;
			$rootScope.currentSong = null;
			$scope.header = "My Library";
			$scope.playlistView = false;


			if ($scope.view.length) {
				$scope.hasSongs = true;
			}
			$scope.load = function(songId, index){
				// console.log("in functino", songId, , $scope.view);
				$rootScope.currentSong = songId;
				$rootScope.nextSong = $scope.view[parseInt(index) + 1];
				console.log("CURRENT SONG: ",$rootScope.currentSong);
				console.log("NEXT SONG: ",$rootScope.nextSong);
			};
		});
	}

	$scope.sean = "poop";


	$scope.removePlaylist = function(id){
		PlaylistFactory.deletePlaylist(id)
		.then(function(){
			$scope.playlists.splice($scope.playlists.indexOf(id));
			$state.go('home');
		});
	};
});
