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

                console.log('soundcloudVid', soundcloudVideo);
                soundcloudVideo.attr('src', response.http_mp3_128_url);
                theVideo.play();
                serviceMethods.Soundcloud = {
                    play: theVideo.play,
                    pause: theVideo.pause,
                    reference: theVideo
                };
            });
        }).catch(function () {
            console.error(arguments);
        });
    };
    SC.resolve(songUrl).then(streamTrack);
}
