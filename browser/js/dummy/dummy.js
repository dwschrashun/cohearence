doc = $(document);
doc.ready(createYouTubeVideo);
window.parent.document.addEventListener('test', function(){
	var event2 = new CustomEvent('test2', {'detail': 'testDetail'});
	window.parent.document.dispatchEvent(event2);
});

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
      // serviceMethods.YouTube = {
      //   play: youtubePlayer.playVideo,
      //   pause: youtubePlayer.pauseVideo,
      //   reference: youtubePlayer,
      //   checkTime: youtubePlayer.getCurrentTime,
      //   seekTo: youtubePlayer.seekTo
      // };
    }

		function onPlayerStateChange(event) {
        // if (event.data === 0) {
        //     var nextSong = autoPlayNextSong('forward');
        //     cueSong(nextSong);
        // }
    }
}

function logYtError (event) {
    console.log("logYtError event:", event);
}
