//watching track name text on right side player for change

function onPlayerChange() {
	var player = $($("#app-player").contents().find("#track-name")[0]);
	console.log('got the player', player);
	player.bind("DOMSubtreeModified", function () {
		counter++;
		if (counter == 2) {
			// console.log('song changed');
			var song;
			getSongInfo().then(function (songObj) {
				song = songObj;
				console.log('song', song);
				counter = 0;
			});
		}
	});
}

function getSongInfo() {
	var songTitle = $($("#app-player").contents().find("#track-name")[0]).text();
	var duration = $($("#app-player").contents().find("#track-length")).text();
	var href = $($("#app-player").contents().find("#track-name > a")[0]).attr("href");
	var song = new Promise (function (resolve, reject) {
		return resolve (
			setTimeout(function () {
				artist = $($("#app-player").contents().find("#track-artist > a")[0]).text();
				var videoTitle = artist + ' - ' + songTitle;
				var songObj = {
				    message: "spotifySng",
				    href: href,
				    videoTitle: videoTitle,
				    category: 'Music',
				    duration: duration,
				    songTitle: songTitle,
				    artist: artist
				};
				console.log('spotify songObj', songObj);
				return songObj;
			}, 500)
		);
	});
	return song;
}

var counter = 0;

$('iframe#app-player').load(function () {
    // console.log('window loaded');
    onPlayerChange();
});