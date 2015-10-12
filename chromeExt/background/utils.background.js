function sendSong(songObj) {
    var user = getUser();
    if (user) {
        $.ajax({
                url: environment.server + "/api/users/" + user._id + "/library",
                method: 'PUT',
                data: songObj,
                dataType: "json"
            })
            .done(function (response) {
                setUser(response);
            })
            .fail(function (error) {
                console.log(error);
            });
    }
}

function cueSong(request) {
    if (request.service === 'YouTube') {
        console.log('cueing youtube song');
        youtubePlayer.loadVideoById(request.id);
    }
    if (request.service === 'Soundcloud') {
        createSoundcloudVideo(request.id);
    }
    if (request.service === 'Bandcamp') {
        console.log('cueing bandcamp song', request);
        createBandcampVideo(request.id);
    }
}

function stopAllVideos() {
    if (youtubePlayer) youtubePlayer.stopVideo();
    if (soundcloudVideo[0]) soundcloudVideo[0].pause();
    if (bandcampVideo[0]) bandcampVideo[0].pause();
}

function autoPlayNextSong(direction) {
    var musicLibrary = getUser().musicLibrary;
    var request = {};
    
    if (direction === 'forward') currentSongIndex += 1;
    if (direction === 'backward') currentSongIndex -= 1;
    if (currentSongIndex === musicLibrary.length || currentSongIndex < 0) {
        return;
    }
    
    var song = musicLibrary[currentSongIndex].song;
    
    if (song.source.domain === 'YouTube' || song.source.domain === "Spotify") {
        request.service = "YouTube";
    }
    if (song.source.domain === 'Soundcloud') {
        var streamable = checkSoundcloudStreamable(song);
        if (streamable) {
            request.service = 'Soundcloud';
        } else {
            $scope.currentService = "YouTube";
            request.service = 'YouTube';
        }
    }
    if (song.source.domain === 'Bandcamp') {
        request.service = 'Bandcamp';
    }
    request.id = song.source.url;
    return request;
}

function checkSoundcloudStreamable(song) {
    if (song.source.url.indexOf('soundcloud') === -1) {
        // console.log('not streamable', song);
        return false;
    }
    return true;
}

function getPlayerState() {
    var playerStates = {};
    if (youtubePlayer) {
        var youtubeState = youtubePlayer.getPlayerState();
        // youtube has 5 states. We are only concerned with playing and not playing
        playerStates.YouTube = (youtubeState === 1) ? true : false;
    }
    if (soundcloudVideo[0]) {
        playerStates.Soundcloud = !soundcloudVideo[0].paused;
    }
    if (bandcampVideo[0]) {
        playerStates.Bandcamp = !bandcampVideo[0].paused;
    }
    return playerStates;
}

function getCurrentTime(service) {
    var currentTime,
        duration;

    if (service === "YouTube") {
        currentTime = youtubePlayer.getCurrentTime();
        duration = youtubePlayer.getDuration();
    } else if (service === 'Soundcloud') {
        currentTime = soundcloudVideo[0].currentTime;
        duration = soundcloudVideo[0].duration;
    } else if (service === 'Bandcamp') {
        currentTime = bandcampVideo[0].currentTime;
        duration = bandcampVideo[0].duration;
    }
    return [currentTime, duration];
}

function seekTo(time, service) {
    if (service === "YouTube") {
        youtubePlayer.seekTo(time);
    } else if (service === 'Soundcloud') {
        soundCloudVideo[0].currentTime = time;
    } else if (service === 'Bandcamp') {
        bandcampVideo[0].currentTime = time;
    }
}

function getUser() {
    return JSON.parse(localStorage.getItem("cohearenceUser"));
}

function setUser(library) {
    var theUser = getUser();
    theUser.musicLibrary = library;
    var stringifiedUpdatedUser = JSON.stringify(theUser);
    localStorage.setItem("cohearenceUser", stringifiedUpdatedUser);
}

function getBackendUserAndUpdateLocalStorage() {
    var user = getUser();
    if (user) {
        $.ajax({
                url: environment.server + "/api/users/" + user._id + '/library',
                method: 'GET',
                dataType: "json"
            })
            .done(function (response) {
                setUser(response);
            })
            .fail(function (error) {
                console.error(error);
            });
    } else {
        console.log('user not logged in probably should do something about that');
    }
}
