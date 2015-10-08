function onPlayerChange() {
    var player = $($("#app-player").contents().find("#track-name")[0]);
    console.log('got the player', player);
    player.bind("DOMSubtreeModified", function () {
        console.log("modified");
        counter++;
        if (counter == 2) {
            getSongInfo().then(function (songObj) {
                console.log('song', songObj);
                counter = 0;
                if (songObj.url.indexOf('adclick') === -1) {
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
    var songTitle = $($("#app-player").contents().find("#track-name")[0]).text();
    var duration = $($("#app-player").contents().find("#track-length")).text();
    var href = $($("#app-player").contents().find("#track-name > a")[0]).attr("href");
    return new Promise(function (resolve, reject) {
            setTimeout(function () {
                artist = $($("#app-player").contents().find("#track-artist > a")[0]).text();
                var videoTitle = artist + ' - ' + songTitle;
                var songObj = {
                    message: "Spotify",
                    url: href,
                    videoTitle: videoTitle,
                    category: 'Music',
                    duration: duration,
                    title: songTitle,
                    artist: artist
                };
                console.log('spotify songObj', songObj);
                return resolve(songObj);
            }, 500);
    });
}

var counter = 0;

$('iframe#app-player').load(function () {
    // console.log('window loaded');
    onPlayerChange();
});
