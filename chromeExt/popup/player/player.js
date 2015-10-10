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
            if ($scope.currentService !== null) $scope.paused = false;
        });
    }
    // This needs to run everytime the controller loads
    whoIsPlaying();

    $scope.loadSong = function (song) {
        $scope.currentSong = song;
        $scope.paused = false;
        var request = {
            message: "cue",
			service: $scope.currentService
        };
        if (song.source.domain === 'YouTube' || song.source.domain === "Spotify") {
            $scope.currentService = "YouTube";
            // console.log("request in loadsong:", request, song);
            request.id = song.source.url;
            request.service = "YouTube";
            // console.log("youtube message sending", request);
        }
        if (song.source.domain === 'Soundcloud') {
            var streamable = PlayerFactory.checkSoundcloudStreamable(song);
            if (streamable) {
                $scope.currentService = 'Soundcloud';
                request.id = song.source.url;
                request.service = 'Soundcloud';
                // console.log('loading Soundcloud song');
            } else {
                $scope.currentService = "YouTube";
                request.id = song.source.url;
                request.service = 'YouTube';
                // console.log('streamable', streamable, request);
            }
        }
        if (song.source.domain === 'Bandcamp') {
            $scope.currentService = 'Bandcamp';
            request.service ='Bandcamp';
            request.id = song.source.url;
            console.log('loading bandcamp song', song, request);
        }
        chrome.runtime.sendMessage(request, function (response) {
            // console.log('response from router:', response);
        });
    };

    $scope.playVideo = function () {
        $scope.paused = false;
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
