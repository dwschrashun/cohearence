app.config(function($stateProvider) {
	$stateProvider.state("player", {
		url: '/player',
		templateUrl: '/popup/player/player.html',
		controller: 'playerCtrl',
		resolve: {
			theUser: function(LoginFactory) {
				return LoginFactory.isLoggedIn();
			}
		}
	})
})

app.controller('playerCtrl', function($scope, LoginFactory, theUser, $state) {
	console.log(theUser);
	$scope.musicLibrary = theUser.musicLibrary;
	$scope.logout = function() {
		LoginFactory.logout()
		.then(function() {
			$state.go('login');
		});
	};

	$scope.setBandcampIframe = function(id) {
		$scope.id = id;

		$scope.iFrameURL = "http://bandcamp.com/EmbeddedPlayer/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=" + id + "/transparent=true/";
		var cl = document.getElementsByTagName("iframe")[0];
		cl.src = "http://bandcamp.com/EmbeddedPlayer/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=" + id + "/transparent=true/";
		var play = document.getElementById('big_play_icon');
		console.log(play);
	};

	$scope.pause = function() {
		var cl = document.getElementsByTagName("iframe")[0];
		cl.src = "";
	}

	$scope.play = function() {
		var cl = document.getElementsByTagName("iframe")[0];
		cl.src = "http://bandcamp.com/EmbeddedPlayer/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=" + $scope.id + "/transparent=true/";
	}
});
