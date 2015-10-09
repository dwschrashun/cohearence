function createSoundcloudVideo(songUrl) {
    var theVideo = soundcloudVideo[0];
    SC.initialize({
        client_id: '68b135c934141190c88c1fb340c4c10a'
    });
    var streamTrack = function (track) {
        console.log('soundcloudVideo', soundcloudVideo);
        return SC.stream('/tracks/' + track.id).then(function (player) {
            $.ajax({
                method: 'get',
                url: track.stream_url + "s?client_id=68b135c934141190c88c1fb340c4c10a"
            }).done(function (response) {

				console.log("THE VIDEO: ",theVideo);
				console.log(response);

				if (response.http_mp3_128_url){
                	soundcloudVideo.attr('src', response.http_mp3_128_url);
				} else if (response.hls_mp3_128_url){
					soundcloudVideo.attr('src', response.hls_mp3_128_url);
				}  else if (rtmp_mp3_128_url) {
					soundcloudVideo.attr('src', response.rtmp_mp3_128_url);
				} else {
					soundcloudVideo.attr('src', 'SKULLTRUMPET.mp3');
				}
                theVideo.play();
                serviceMethods.Soundcloud = {
                    play: theVideo.play,
                    pause: theVideo.pause,
                    reference: theVideo
                };
            }).fail(function(){console.log("failed")});
        }).catch(function () {
            console.error(arguments);
        });
    };
    SC.resolve(songUrl).then(streamTrack).then(null, function(err){
		console.log(err);
	});
}
