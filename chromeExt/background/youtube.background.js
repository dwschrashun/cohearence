function createYouTubeVideo() {
    var tag = $('<script></script>');
    tag.attr('src', "https://www.youtube.com/iframe_api");
    var firstScriptTag = $(backgroundDoc.find('script')[0]);
    tag.insertBefore(firstScriptTag);
    youtubePlayer = backgroundDoc.find("#youtubePlayer");
    setTimeout(() => {
        youtubePlayer = new YT.Player(youtubePlayer[0], {
            height: '390',
            width: '640',
            events: {
                "onReady": onPlayerReady,
                "onStateChange": onPlayerStateChange
            }
        });
    }, 800);

    function onPlayerReady(event) {
        serviceMethods.YouTube = {
            play: youtubePlayer.playVideo,
            pause: youtubePlayer.pauseVideo,
            reference: youtubePlayer,
            checkTime: youtubePlayer.getCurrentTime,
            seekTo: youtubePlayer.seekTo
        };
    }

    function onPlayerStateChange(event) {
        console.log('running youtube player state', event.data);
        if (event.data === 0) {
            var nextSong = autoPlayNextSong();
            console.log('playing next song', nextSong);
            cueSong(nextSong);
        }
    }
}
