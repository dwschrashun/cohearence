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

// 2. This code loads the IFrame Player API code asynchronously.
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			// 3. This function creates an <iframe> (and YouTube player)
			//    after the API code downloads.
			var player;
			function onYouTubeIframeAPIReady() {
				console.log('onYouTubeIframeAPIReady run');
				player = new YT.Player('player', {
					height: '390',
					width: '640',
					videoId: 'u3Y_sbAHdPw',
					events: {
						'onReady': onPlayerReady,
						'onStateChange': onPlayerStateChange
					}
				});
			}
			console.log('document ====== ',document);

			// 4. The API will call this function when the video player is ready.
			function onPlayerReady(event) {
				event.target.playVideo();
			}

			// 5. The API calls this function when the player's state changes.
			//    The function indicates that when playing a video (state=1),
			//    the player should play for six seconds and then stop.
			var done = false;
			function onPlayerStateChange(event) {
				if (event.data == YT.PlayerState.PLAYING && !done) {
					setTimeout(stopVideo, 6000);
					done = true;
				}
			}
			function stopVideo() {
				player.stopVideo();
			}

app.controller('playerCtrl', function($scope, LoginFactory, theUser, $state) {





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
