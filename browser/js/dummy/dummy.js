$(document).ready(createYouTubeVideo);


function createYouTubeVideo() {
	console.log('ran the onload');
    var tag = $('<script></script>');
    tag.attr('src', "https://www.youtube.com/iframe_api");
    var firstScriptTag = $('script')[0];
    tag.insertBefore(firstScriptTag);
    youtubePlayer = $("#youtubePlayer");
    setTimeout(() => {
        youtubePlayer = new YT.Player(youtubePlayer[0], {
            height: '390',
            width: '640',
						videoId: 'if-UzXIQ5vw',
            events: {
                "onReady": onPlayerReady,
                "onError": logYtError
                // "onStateChange": onPlayerStateChange
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
}

function logYtError (event) {
    console.log("logYtError event:", event);
}
