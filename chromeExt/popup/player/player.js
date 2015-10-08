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
	$scope.currentService = 'Soundcloud';

	$scope.loadSong = function(song){
		$scope.currentSong = song;
		$scope.currentService = song.source.domain;
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
		var request = {message: "playerAction", action: "play", service: $scope.currentService};
		console.log("play message sending", request);
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
	};

	$scope.pauseVideo = function(){
		var request = {message: "playerAction", action: "pause", service: $scope.currentService};
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
	};

	$scope.skipForward = function(){
		var request = {message: "test", service: $scope.currentService};
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
		player.seekTo(player.getCurrentTime() + 15);
	};

	$scope.unMute = function () {
		var request = {message: "unMute", service: $scope.currentService};
		chrome.runtime.sendMessage(request, function (response) {
	        console.log('response from router:', response);
	    });
	};

	$scope.startOrStopFastForward = function(toggle) {
		console.log('perform on fast forward ', toggle);
		var ff = () => player.seekTo(player.getCurrentTime() + 1);
		if (toggle === 'stop') clearInterval(fastForward);
		else fastForward = setInterval(ff, 100);
	};

	$scope.startOrStopRewind = function(toggle) {
		console.log('perform on fast forward ', toggle);
		var ff = () => player.seekTo(player.getCurrentTime() - 1);
		if (toggle === 'stop') clearInterval(fastForward);
		else fastForward = setInterval(ff, 100);
	};

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
	};

	$scope.play = function() {
		var cl = document.getElementsByTagName("iframe")[0];
		cl.src = "http://bandcamp.com/EmbeddedPlayer/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=" + $scope.id + "/transparent=true/";
	};
});
