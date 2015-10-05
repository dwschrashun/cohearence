function getSongInfo() {
    var songInfo = $(".playbackSoundBadge__titleContextContainer").children()[1];
    var duration = $(".playbackTimeline__duration").children()[1].innerText;
    var artistTitle = songInfo.title.split(' - ');
    artist = artistTitle[0];
    title = artistTitle[1];
    var songObj = {
        message: "soundCloudSong",
        href: songInfo.href,
        videoTitle: songInfo.title,
        category: 'Music',
        duration: duration,
        songTitle: title,
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
                if (lastSong !== songObj.songTitle) {
            		lastSong = songObj.songTitle;
                    console.log('sending song');
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
