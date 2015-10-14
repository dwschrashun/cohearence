app.directive('player', function () {
	return {
		restrict: "E",
		templateUrl: "/js/common/directives/web-player/web-player.html",
		controller: function ($scope, $rootScope) {
			$scope.$on("sendFirstSong", function (event, song) {
				//console.log("recieved first song", song);
				$rootScope.current = song;
			});
			$rootScope.paused = true;
			$scope.togglePaused = function($event) {
				if (!$event || !$rootScope.paused) {
					$rootScope.paused = !$rootScope.paused;
				}
				else {
					console.log("event, paused", $event, $rootScope.paused);
				}
				if (!$rootScope.current) {
					//console.log("broadcasting");
					$scope.$broadcast("getFirstSong");
				}
			};
				

		    // $scope.playVideo = function () {
		    //     $scope.paused = false;
		    //     var request = {
		    //         message: "playerAction",
		    //         action: "play",
		    //         service: $scope.currentService
		    //     };

		    //     //if footer play button is clicked and no current service is set, set it to service of first song in music library
		    //     var firstSongObj = $scope.musicLibrary[0];
		    //     if (!request.service && firstSongObj) {
		    //         var firstSongService = firstSongObj.song.source.domain;
		    //         if (firstSongService) {
		    //             request.service = firstSongService;
		    //             $scope.loadSong(firstSongObj.song)
		    //         }
		    //     }
		    //     //if footer OR specific song button is clicked and current service exists
		    //     else {
		    //       chrome.runtime.sendMessage(request, function (response) {
		    //       });
		    //     }
		    // };
		    // $scope.pauseVideo = function () {
		    //     $scope.paused = true;
		    //     var request = {
		    //         message: "playerAction",
		    //         action: "pause",
		    //         service: $scope.currentService
		    //     };
		    //     chrome.runtime.sendMessage(request, function (response) {
		    //         // console.log('response from router:', response);
		    //     });
		    // };
		}
	};

});
		    // function whoIsPlaying() {
		    //     chrome.runtime.sendMessage('whoIsPlaying', function (response) {
		    //         $scope.currentService = PlayerFactory.setCurrentService(response);
		    //         if ($scope.currentService !== null) $scope.paused = false;
		    //     });
		    // }
		    // // This needs to run everytime the controller loads
		    // $scope.paused = true;
		    // whoIsPlaying();

		    // $scope.loadSong = function (song) {
		    //     $scope.currentSong = song;
		    //     $scope.paused = false;
		    //     var request = {
		    //         message: "cue",
		    //               service: $scope.currentService
		    //     };
		    //     if (song.source.domain === 'YouTube' || song.source.domain === "Spotify") {
		    //         $scope.currentService = "YouTube";
		    //         request.id = song.source.url;
		    //         request.service = "YouTube";
		    //     }
		    //     if (song.source.domain === 'Soundcloud') {
		    //         var streamable = PlayerFactory.checkSoundcloudStreamable(song);
		    //         if (streamable) {
		    //             $scope.currentService = 'Soundcloud';
		    //             request.id = song.source.url;
		    //             request.service = 'Soundcloud';
		    //         } else {
		    //             $scope.currentService = "YouTube";
		    //             request.id = song.source.url;
		    //             request.service = 'YouTube';
		    //         }
		    //     }
		    //     if (song.source.domain === 'Bandcamp') {
		    //         $scope.currentService = 'Bandcamp';
		    //         request.service ='Bandcamp';
		    //         request.id = song.source.url;
		    //         console.log('loading bandcamp song', song, request);
		    //     }
		    //     chrome.runtime.sendMessage(request, function (response) {
		    //     });
		    // };


		    // $scope.skipForward = function () {
		    //     var request = {
		    //         message: "test",
		    //         service: $scope.currentService
		    //     };
		    //     chrome.runtime.sendMessage(request, function (response) {
		    //         // console.log('response from router:', response);
		    //     });
		    //     player.seekTo(player.getCurrentTime() + 15);
		    // };

		    // $scope.unMute = function () {
		    //     var request = {
		    //         message: "unMute",
		    //         service: $scope.currentService
		    //     };
		    //     chrome.runtime.sendMessage(request, function (response) {
		    //         // console.log('response from router:', response);
		    //     });
		    // };

		    // $scope.startOrStopFastForward = function (toggle) {
		    //     // console.log('perform on fast forward ', toggle);
		    //     var ff = () => player.seekTo(player.getCurrentTime() + 1);
		    //     if (toggle === 'stop') clearInterval(fastForward);
		    //     else fastForward = setInterval(ff, 100);
		    // };

		    // $scope.startOrStopRewind = function (toggle) {
		    //     // console.log('perform on fast forward ', toggle);
		    //     var ff = () => player.seekTo(player.getCurrentTime() - 1);
		    //     if (toggle === 'stop') clearInterval(fastForward);
		    //     else fastForward = setInterval(ff, 100);
		    // };

		    // $scope.seekTo = function(time) {
		    //   var request = {
		    //     message: "changeTimeAction",
		    //     action: "seekTo",
		    //     service: $scope.currentService,
		    //     time: time
		    //   }

		    //   chrome.runtime.sendMessage(request, function(response) {

		    //   })
		    // }

		    // $scope.musicLibrary = theUser.musicLibrary;
		    // console.log($scope.musicLibrary);
		    // $scope.logout = function () {
		    //     LoginFactory.logout()
		    //         .then(function () {
		    //             $scope.pauseVideo();
		    //             $state.go('login');
		    //         });
		    // };