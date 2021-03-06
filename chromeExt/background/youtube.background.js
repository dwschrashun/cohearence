function createYouTubeVideo() {
    var tag = $('<script></script>');
    tag.attr('src', "https://www.youtube.com/iframe_api?version=3");
    var firstScriptTag = $(backgroundDoc.find('script')[0]);
    tag.insertBefore(firstScriptTag);
    youtubePlayer = backgroundDoc.find("#youtubePlayer");
    setTimeout(() => {
        youtubePlayer = new YT.Player(youtubePlayer[0], {
            height: '390',
            width: '640',
            events: {
                "onReady": onPlayerReady,
                "onError": logYtError,
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
        if (event.data === 0) {
            var nextSong = autoPlayNextSong('forward');
            cueSong(nextSong);
        }
    }
}

function logYtError (event) {
    console.log("logYtError event:", event);
    if (event.data === 150 || event.data === 101) {

    }
}
