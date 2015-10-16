var socket;

var doc = $(document);
doc.ready(function () {
  createYouTubeVideo();
  socket = io.connect("https://aqueous-gorge-7560.herokuapp.com/");

  //load song
  socket.on("loadBackground", function (data) {
    cueSong(data);
    socket.emit("songLoaded", data);
  });

  //pause song
  socket.on('pauseBackground', function(data) {
    if (data.service === 'YouTube') {
        alert('PAUSING!')
        youtubePlayer.pauseVideo();
        socket.emit("songPaused", data.service);
    }
  });

  socket.on('playBackground', function(data) {
    if (data.service === 'YouTube') {
        youtubePlayer.playVideo();
        socket.emit("songPlayed", data.service);
    }
  });

});


function cueSong(request) {
    console.log('request from autoplay', request);
    if (request.service === 'YouTube') {
        var url = request.ytUrl;
        youtubePlayer.cueVideoByUrl({
            mediaContentUrl: url
        });
        youtubePlayer.playVideo();
        // youtubePlayer.loadVideoById(request.id);
    }
    if (request.service === 'Soundcloud') {
        createSoundcloudVideo(request.id);
    }
    if (request.service === 'Bandcamp') {
        createBandcampVideo(request.id);
    }
}


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
    socket.emit("ytError", event);
    console.log("logYtError event:", event);
}
