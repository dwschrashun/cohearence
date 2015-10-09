app.config(function ($stateProvider) {
    $stateProvider.state("player", {
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

app.controller('playerCtrl', function ($scope, LoginFactory, PlayerFactory, theUser, $state) {
    function whoIsPlaying() {
        chrome.runtime.sendMessage('whoIsPlaying', function (response) {
            $scope.currentService = PlayerFactory.setCurrentService(response);
        });
    }
    // This needs to run everytime the controller loads
    whoIsPlaying();

    $scope.loadSong = function (song) {
        $scope.currentSong = song;
        $scope.currentService = song.source.domain;
        var request = {
            message: "cue",
			service: $scope.currentService
        };
        if (song.source.domain === 'YouTube') {
            request.id = PlayerFactory.getVideoId(song);
            console.log("youtube message sending", request);
        }
        if (song.source.domain === 'Soundcloud') {
            request.id = song.source.url;
            console.log('loading Soundcloud song');
        }
        if (song.source.domain === 'Bandcamp') {
            request.id = song.source.bandcampId;
            console.log('loading bandcamp song');
        }
        chrome.runtime.sendMessage(request, function (response) {
            console.log('response from router:', response);
        });
    };

    $scope.playVideo = function () {
        var request = {
            message: "playerAction",
            action: "play",
            service: $scope.currentService
        };
        chrome.runtime.sendMessage(request, function (response) {
            // console.log('response from router:', response);
        });
    };

    $scope.pauseVideo = function () {
        var request = {
            message: "playerAction",
            action: "pause",
            service: $scope.currentService
        };
        chrome.runtime.sendMessage(request, function (response) {
            // console.log('response from router:', response);
        });
    };

    $scope.skipForward = function () {
        var request = {
            message: "test",
            service: $scope.currentService
        };
        chrome.runtime.sendMessage(request, function (response) {
            // console.log('response from router:', response);
        });
        player.seekTo(player.getCurrentTime() + 15);
    };

    $scope.unMute = function () {
        var request = {
            message: "unMute",
            service: $scope.currentService
        };
        chrome.runtime.sendMessage(request, function (response) {
            // console.log('response from router:', response);
        });
    };

    $scope.startOrStopFastForward = function (toggle) {
        // console.log('perform on fast forward ', toggle);
        var ff = () => player.seekTo(player.getCurrentTime() + 1);
        if (toggle === 'stop') clearInterval(fastForward);
        else fastForward = setInterval(ff, 100);
    };

    $scope.startOrStopRewind = function (toggle) {
        // console.log('perform on fast forward ', toggle);
        var ff = () => player.seekTo(player.getCurrentTime() - 1);
        if (toggle === 'stop') clearInterval(fastForward);
        else fastForward = setInterval(ff, 100);
    };

    $scope.musicLibrary = theUser.musicLibrary;
    $scope.logout = function () {
        LoginFactory.logout()
            .then(function () {
				$scope.pauseVideo();
                $state.go('login');
            });
    };

});
