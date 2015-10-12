app.config(function ($stateProvider) {
    $stateProvider
        .state("player", {
            url: '/player',
            templateUrl: '/popup/player/player.html',
            controller: 'playerCtrl',
            resolve: {
                theUser: function (LoginFactory) {
                    return LoginFactory.isLoggedIn();
                },
                playlists: function (PlayerFactory) {
                    return PlayerFactory.getPlaylists();
                }
            }
        }).state('player.musicLibrary', {
            url: '/musicLibrary',
            templateUrl: "../popup/musicLibrary/musicLibrary.html"
        }).state('player.playlists', {
            url: '/playlists',
            templateUrl: '../popup/playlists/playlists.html'
        });
});

app.controller('playerCtrl', function ($scope, LoginFactory, PlayerFactory, theUser, playlists, $state) {
    function whoIsPlaying() {
        chrome.runtime.sendMessage('whoIsPlaying', function (response) {
            $scope.currentSong = theUser.musicLibrary[response.currentIndex].song
            console.log($scope.currentSong);
            if ($scope.currentSong) loadPlayingIcon($scope.currentSong._id)
            $scope.currentService = PlayerFactory.setCurrentService(response);
            if ($scope.currentService !== null) $scope.paused = false;
        });
    }
    // This needs to run everytime the controller loads
    $scope.paused = true;
    whoIsPlaying();
    console.log('playlists', playlists);

    function removePlayingIconFromPreviousSong() {
        if ($scope.currentSong) {
            var prevSong = $('#' + $scope.currentSong._id + ' .status');
            if (prevSong) prevSong.addClass('not-playing')
        }
    }

    function loadPlayingIcon(id) {
        console.log('called again!');
        var thisSong = $('#' + id + ' .status');
        console.log (thisSong);
        thisSong.removeClass('not-playing');
    }

    $scope.loadSong = function (song, songIndex) {
        removePlayingIconFromPreviousSong();
        $scope.currentSong = song;
        loadPlayingIcon(song._id);
        $scope.paused = false;
        var request = {
            message: "cue",
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
            request.service = 'Bandcamp';
            request.id = song.source.url;
            console.log('loading bandcamp song', song, request);
        }
        chrome.runtime.sendMessage(request, function (response) {});
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
            chrome.runtime.sendMessage(request, function (response) {});
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
        chrome.runtime.sendMessage(request, function (response) {
            console.log('changed song response', response);
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

    $scope.seekTo = function (time) {
        var request = {
            message: "changeTimeAction",
            action: "seekTo",
            service: $scope.currentService,
            time: time
        };

        chrome.runtime.sendMessage(request, function (response) {

        });
    };

    $scope.musicLibrary = theUser.musicLibrary;
    console.log($scope.musicLibrary);
    $scope.logout = function () {
        LoginFactory.logout()
            .then(function () {
                $scope.pauseVideo();
                $state.go('login');
            });
    };

    $scope.goToPlaylists = function () {
        $state.go('player.playlists');
    };
    $scope.goToMusicLibrary = function () {
        $state.go('player.musicLibrary');
    };
});
