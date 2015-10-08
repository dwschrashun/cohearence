function getSongInfo() {
    var songInfoArr = $(".playbackSoundBadge__titleContextContainer").children();
    var songInfo = songInfoArr[1];
    var channelName = songInfoArr.first().text().split("Playing from ")[1].split("\'")[0];
    var duration = $(".playbackTimeline__duration").children()[1].innerText;
    var artistTitle = songInfo.title.split(/[-–]/);

	if (artistTitle.length === 1) {
		title = artistTitle[0].trim();
		artist = channelName || "unknown artist";
	} else if (artistTitle.length === 0){
		artist = channelName || "unknown artist";
		title = "unknown title";
	} else {
    	artist = artistTitle[0].trim() || channelName || "unknown artist";
    	title = artistTitle[1].trim() || "unknown title";
	}

    var songObj = {
        action: 'scrobble',
        message: "Soundcloud",
        url: songInfo.href,
        videoTitle: songInfo.title,
        category: 'Music',
        duration: duration,
        title: title,
        artist: artist
    };
    return songObj;
}

function onPlayerChange() {
    var player = $(".playControls__soundBadge");
    player.bind("DOMSubtreeModified", function () {
        counter += 1;
        if (counter === 6) {
            var songObj = getSongInfo();
            if (songObj.duration !== "0:30") {
                if (lastSong !== songObj.title) {
            		lastSong = songObj.title;
                    chrome.runtime.sendMessage(songObj, function (response) {
                        console.log('response from router:', response);
                    });
                }
            }
            counter = 0;
        }
    });
}
var counter = 0;
var lastSong;

$(document).ready(function () {
    console.log('window loaded');
    onPlayerChange();
});
