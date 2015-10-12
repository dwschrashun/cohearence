function cueSong(request) {
    if (request.service === 'YouTube') {
        console.log('cueing youtube song');
        youtubePlayer.loadVideoById(request.id);
    }
    if (request.service === 'Soundcloud') {
        createSoundcloudVideo(request.id);
    }
    if (request.service === 'Bandcamp') {
        createBandcampVideo(request.id);
    }
}

function stopAllVideos() {
    if (youtubePlayer) youtubePlayer.stopVideo();
    if (soundcloudVideo[0]) soundcloudVideo[0].pause();
    if (bandcampVideo[0]) bandcampVideo[0].pause();
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

function getCurrentTime (service) {
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
    console.log('HITTING SEEK TO');
    if (service === "YouTube") {
        youtubePlayer.seekTo(time);
    } else if (service === 'Soundcloud') {
        soundcloudVideo[0].currentTime = time;
    } else if (service === 'Bandcamp') {
        bandcampVideo[0].currentTime = time;
    }
}
