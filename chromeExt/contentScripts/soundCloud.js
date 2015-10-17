function getSongInfo() {
    var songInfoArr = $(".playbackSoundBadge__titleContextContainer").children();
    var songInfo = songInfoArr[1];

	var channelName;
	var playingFrom = songInfoArr.first().text();
	if (playingFrom.indexOf('profile') > -1 || playingFrom.indexOf('playlists') > -1){
		channelName = playingFrom.split("Playing from ")[1].split("\'")[0];
	} else if (playingFrom === "Playing track") {
		channelName = $(".soundTitle__usernameHeroContainer").children().first().text().trim() || $(".soundTitle__usernameText").text().trim();
	}

    // var channelName = songInfoArr.first().text().split("Playing from ")[1].split("\'")[0];
    var duration = $(".playbackTimeline__duration").children()[1].innerText;
    var artistTitle = songInfo.title.split(/[-–~]/);

    if (artistTitle.length === 1) {
        title = artistTitle[0].trim();
        artist = channelName || "unknown artist";
    } else if (artistTitle.length === 0) {
        artist = channelName || "unknown artist";
        title = "unknown title";
    } else {
        artist = artistTitle[0].trim() || channelName|| "unknown artist";
        title = artistTitle[1].trim() || "unknown title";
    }

    var songObj = {
        action: 'scrobble',
        message: "Soundcloud",
        source: {
            url: songInfo.href,
            videoTitle: songInfo.title,
            domain: "Soundcloud",
            bandcampId: null,
            sourceUrl: songInfo.href
        },
        category: 'Music',
        duration: duration,
        title: title,
        artist: artist
    };
	console.log("final artist and title", songObj.artist, songObj.title);
    return songObj;
}

function onPlayerChange() {
    var player = $(".playControls__soundBadge");
    player.bind("DOMSubtreeModified", function () {
        counter += 1;
        if (counter === 6) {
            var songObj = getSongInfo();
            if (songObj.duration !== '0:30') {
                if (lastSong !== songObj.title) {
                    lastSong = songObj.title;
                    var request = {
                        message: 'checkForStreamable',
                        song: songObj
                    };
                    chrome.runtime.sendMessage(request, function (response) {
                        if (response) {
                            chrome.runtime.sendMessage(songObj, function (response) {
                                // console.log('response from router:', response);
                            });
                        } else {
                            request.message = 'ytCall';
                            request.artist = songObj.artist;
                            request.title = songObj.title;
                            chrome.runtime.sendMessage(request, function (response) {
                                songObj.source.url = response;
                                chrome.runtime.sendMessage(songObj, function (response) {
                                });
                            });
                        }
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
