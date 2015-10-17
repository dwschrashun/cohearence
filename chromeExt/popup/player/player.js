'use strict'

app.config(function ($stateProvider) {
    $stateProvider
        .state("player", {
            url: '/player',
            templateUrl: '/popup/player/player.html',
            controller: 'playerCtrl',
            resolve: {
                theUser: function (LoginFactory) {
                    return LoginFactory.isLoggedIn();
                }
            }
        });
});

app.controller('playerCtrl', function ($scope, LoginFactory, PlayerFactory, theUser, $state, $timeout) {

    $scope.musicLibrary = theUser.musicLibrary;

    function whoIsPlaying() {
        var request = {
            message: "whoIsPlaying",
            action: "whoIsPlaying"
        };
        chrome.runtime.sendMessage(request, function (response) {
            $scope.currentService = PlayerFactory.setCurrentService(response) || response.currentService;
            console.log('isPaused:', response.isPaused);
            $scope.paused = response.isPaused;

            if ($scope.currentService !== null) {
                if(theUser.musicLibrary[response.currentIndex].song) {
                    $scope.currentSong = theUser.musicLibrary[response.currentIndex].song;
                    console.log('current song playing', $scope.currentSong);
                    $timeout(function() {
                        loadPlayingIcon($scope.currentSong._id);
                    }, 200);
                }
            }
        });
    }
    // This needs to run everytime the controller loads

    $scope.paused = true;
    whoIsPlaying();

    function removePlayingIconFromPreviousSong() {
        if ($scope.currentSong) {
            var prevSong = $('#' + $scope.currentSong._id + ' .status');
            if (prevSong) prevSong.addClass('not-playing');
        }
    }

    function loadPlayingIcon(id) {
        var thisSong = $('#' + id + ' .status');
        thisSong.removeClass('not-playing');
    }

    $scope.loadSong = function (song, songIndex) {
        removePlayingIconFromPreviousSong();
        $scope.currentSong = song;
        loadPlayingIcon(song._id);
        $scope.paused = false;
        var request = {
            message: "cue",
            action: "cue",
			service: $scope.currentService,
            songIndex: songIndex
        };
        if (song.source.domain === 'YouTube' || song.source.domain === "Spotify") {
            $scope.currentService = "YouTube";
            request.id = song.source.url;
            request.service = "YouTube";
        }
        if (song.source.domain === 'Soundcloud') {
            var streamable = PlayerFactory.checkSoundcloudStreamable(song);
            if (streamable) {
                $scope.currentService = 'Soundcloud';
                request.id = song.source.url;
                request.service = 'Soundcloud';
            } else {
                $scope.currentService = "YouTube";
                request.id = song.source.url;
                request.service = 'YouTube';
            }
        }
        if (song.source.domain === 'Bandcamp') {
            $scope.currentService = 'Bandcamp';
            request.service ='Bandcamp';
            request.id = song.source.url;
        }
        chrome.runtime.sendMessage(request, function (response) {
        });
    };

    $scope.playVideo = function () {
        $scope.paused = false;
        var request = {
            message: "playerAction",
            action: "play",
            service: $scope.currentService
        };

        //if footer play button is clicked and no current service is set, set it to service of first song in music library
        var firstSongObj = $scope.musicLibrary[0];
        if (!request.service && firstSongObj) {
            var firstSongService = firstSongObj.song.source.domain;
            if (firstSongService) {
                request.service = firstSongService;
                $scope.loadSong(firstSongObj.song);
            }
        }
        //if footer OR specific song button is clicked and current service exists
        else {
          chrome.runtime.sendMessage(request, function (response) {
          });
        }
    };

    $scope.pauseVideo = function () {
        $scope.paused = true;
        var request = {
            message: "playerAction",
            action: "pause",
            service: $scope.currentService
        };
        chrome.runtime.sendMessage(request, function (response) {
            // console.log('response from router:', response);
        });
    };

    $scope.changeSong = function (action) {
        var request = {
            message: 'changeSong',
            direction: action
        };
        removePlayingIconFromPreviousSong();
        chrome.runtime.sendMessage(request, function (response) {
            var newIndex = response.nextSongIndex;
            $scope.currentSong = $scope.musicLibrary[newIndex].song;
            loadPlayingIcon($scope.currentSong._id);
        });
    };

    $scope.seekTo = function(time) {
      var request = {
        message: "changeTimeAction",
        action: "seekTo",
        service: $scope.currentService,
        time: time
      };

      chrome.runtime.sendMessage(request, function(response) {
      });
    };

    //style scrollbar
    $scope.config = {
        autoHideScrollbar: false,
        theme: 'rounded-dots-dark',
        advanced: {
            updateOnContentResize: true
        },
        scrollInertia: 400
    };

    $scope.logout = function () {
        LoginFactory.logout()
            .then(function () {
				$scope.pauseVideo();
                $state.go('login');
            });
    };

    $scope.goToWebApp = function () {
        let request = {
            message: 'environmentAction'
        };

        chrome.runtime.sendMessage(request, response => {
            console.log('RESPONSE', response);
            chrome.tabs.create({url: response.environment.domain});
        });
    }

});
