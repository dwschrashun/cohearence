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

app.controller('HomeController', function($rootScope, UserFactory, $scope, AuthService, $state, theUser, PlaylistFactory) {
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
			$scope.load = function(song, index){
				$rootScope.current = song;
				$rootScope.next = $scope.view[parseInt(index) + 1];
				console.log("CURRENT SONG: ",$rootScope.current);
				console.log("NEXT SONG: ",$rootScope.next);
			};
		});
	}



	$scope.removePlaylist = function(id){
		PlaylistFactory.deletePlaylist(id)
		.then(function(){
			$scope.playlists.splice($scope.playlists.indexOf(id));
			$state.go('home');
		});
	};
	$scope.delete = function(song){
		UserFactory.deleteSong($scope.theUser._id, song.song._id)
		.then(function(){
			$scope.view = _.without($scope.view, $scope.view[$scope.view.indexOf(song)]);
		});
	};
});
