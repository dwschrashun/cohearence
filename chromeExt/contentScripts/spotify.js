function onPlayerChange() {
    var player = $($("#app-player").contents().find("#track-name")[0]);
    player.bind("DOMSubtreeModified", function () {
        counter++;
        if (counter == 2) {
            getSongInfo().then(function (songObj) {
                counter = 0;
                console.log("Populated Song Obj:", songObj);
                if (songObj.source.url.indexOf('adclick') === -1) {
	                chrome.runtime.sendMessage(songObj, function (response) {
	                    console.log('response from router:', response);
	                });
                }
            });
        }
    });
}

//timeout set in order to catch changes to artist name on DOM, which is fired after track name change
function getSongInfo() {
    var appPlayer = $("#app-player").contents();
    var songTitle = appPlayer.find("#track-name").text();
    var duration = appPlayer.find("#track-length").text();
    var href = appPlayer.find("#track-name > a").attr("href");
    //console.log("appPlayer", appPlayer.find("#track-name > a").attr("href"));
    return new Promise(function (resolve, reject) {
            setTimeout(function () {
                artist = appPlayer.find("#track-artist > a").text();
                var videoTitle = artist + ' - ' + songTitle;
                var songObj = {
                    action: 'scrobble',
                    message: "Spotify",
                    category: 'Music',
                    duration: duration,
                    title: songTitle,
                    artist: artist,
                    source: {
                        domain: "Spotify",
                        url: href,
                        videoTitle: null,
                        bandcampID: null
                    }
                };
                return resolve(songObj);
            }, 500);
    });
}

var counter = 0;

$('iframe#app-player').load(function () {
    onPlayerChange();
});
