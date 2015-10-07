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
	});
});

app.controller('playerCtrl', function($scope, LoginFactory, PlayerFactory, theUser, $state) {

	// var backgroundDoc = chrome.extension.getBackgroundPage().document;
	// console.log("backgroundDoc:", backgroundDoc);
	// var tag = backgroundDoc.createElement('script');
	// tag.src = "https://www.youtube.com/iframe_api";
	// var firstScriptTag = backgroundDoc.getElementsByTagName('script')[0];
	// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	// var player;
	// if (!backgroundDoc.getElementsByTagName('iframe').length) {
	// 	console.log("making player");
	// 	player = backgroundDoc.getElementById("player");
	// 	setTimeout(() => {
	// 		if (player)
	// 	  player = new YT.Player(player, {
	// 	    height: '390',
	// 	    width: '640',
	// 	    videoId: 'H_IcrHMbb8M',
	// 	    events: {
	// 	    	"onReady": onPlayerReady,
	// 	    	"onStateChange": onPlayerStateChange
	// 	    }
	// 	  });
	// 	  console.log("player on first open:", player);
	// 	}, 2000);
	// }
	// else {
	// 	player = backgroundDoc.getElementsByTagName('iframe')[0];
	// 	console.log("player on reopen:", player);
	// }

	function onPlayerReady(event) {
		console.log("player ready", event.target);
		console.log("player", player);
		event.target.unMute();
        event.target.playVideo();
    }

    function onPlayerStateChange () {
    	console.log("player state changed");
    }
	
	$scope.loadSong = function(song){
		$scope.currentSong = song;
		if (song.source.domain === 'YouTube') {
			var request = {message: "cue"};
			request.id = PlayerFactory.getVideoId(song);
			console.log("cue message sending", request);
			chrome.runtime.sendMessage(request, function (response) {
	        	console.log('response from router:', response);
	    	});

			// var id = PlayerFactory.getVideoId(song);
			// player.cueVideoById(id);
			// console.log("player w new song", player);
			// player.unMute();
			// player.playVideo();
		}
	};

	$scope.playVideo = function(){
		var request = {message: "play"};
		console.log("play message sending", request);
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
		// player.playVideo();
	}

	$scope.pauseVideo = function(){
		var request = {message: "pause", service: "YouTube"};
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
		// player.pauseVideo();
	}

	$scope.skipForward = function(){
		var request = {message: "test", service: "YouTube"};
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
		player.seekTo(player.getCurrentTime() + 15);
	}

	$scope.unMute = function () {
		var request = {message: "unMute", service: "YouTube"};
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
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

	console.log("theUser:", theUser);
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
