function onPlayerChange() {
	var player = $($("#app-player").contents().find("#track-name")[0]);
	console.log('got the player', player);
	player.bind("DOMSubtreeModified", function () {
		counter++;
		if (counter == 2) {
			// console.log('song changed');
			var song = getSongInfo();
			console.log('song', song);
			counter = 0;
		}
	});
}

function getSongInfo() {
	var songTitle = $($("#app-player").contents().find("#track-name")[0]).text();
	var artist = $($("#app-player").contents().find("#track-artist > a")[0]).text();
	var duration = $($("#app-player").contents().find("#track-length")).text();
	var href = $($("#app-player").contents().find("#track-name > a")[0]).attr("href");
	var videoTitle = artist + ' - ' + songTitle;
	console.log('artist', artist);
	var songObj = {
	    message: "Spotify",
	    href: href,
	    videoTitle: videoTitle,
	    category: 'Music',
	    duration: duration,
	    songTitle: songTitle,
	    artist: artist
	};
	return songObj;
}

var counter = 0;

$('iframe#app-player').load(function () {
    // console.log('window loaded');
    onPlayerChange();
});
