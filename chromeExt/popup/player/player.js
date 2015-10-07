app.config(function($stateProvider) {
	$stateProvider.state("player", {
		url: '/player',
		templateUrl: '/popup/player/player.html',
		controller: 'playerCtrl',
		resolve: {
			theUser: function(LoginFactory) {
				return LoginFactory.isLoggedIn();
			},
			player: function(){
				var tag = document.createElement('script');

				tag.src = "https://www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

				var player;
				return function onYouTubeIframeAPIReady() {
					console.log('onYouTubeIframeAPIReady run');
					return player = new YT.Player('player', {
						height: '390',
						width: '640',
						videoId: 'H_IcrHMbb8M',
					});
				}
			}
		}
	})
})


			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			var player;
			function onYouTubeIframeAPIReady() {
				console.log('onYouTubeIframeAPIReady run');
				player = new YT.Player('player', {
					height: '390',
					width: '640',
					videoId: 'H_IcrHMbb8M',
				});
			}


app.controller('playerCtrl', function($scope, LoginFactory, theUser, $state) {

$scope.playVideo = function(){
	player.playVideo();
}

$scope.pauseVideo = function(){
	player.pauseVideo();
}

$scope.skipForward = function(){
	player.seekTo(player.getCurrentTime() + 15);
}

$scope.startOrStopFastForward = function(toggle) {
	console.log('perform on fast forward ', toggle);
	var ff = () => player.seekTo(player.getCurrentTime() + 1);
	if (toggle === 'stop') clearInterval(fastForward);
	else fastForward = setInterval(ff, 100);
}

$scope.startOrStopRewind = function(toggle) {
	console.log('perform on fast forward ', toggle);
	var ff = () => player.seekTo(player.getCurrentTime() - 1);
	if (toggle === 'stop') clearInterval(fastForward);
	else fastForward = setInterval(ff, 100);
}

	console.log(theUser);
	$scope.musicLibrary = theUser.musicLibrary;
	$scope.logout = function() {
		LoginFactory.logout()
		.then(function() {
			$state.go('login');
		});
	};

	$scope.setBandcampIframe = function(songObj) {
		$scope.iFrameURL = "http://bandcamp.com/EmbeddedPlayer/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=" + songObj.trackId + "/transparent=true/";

	};
});
