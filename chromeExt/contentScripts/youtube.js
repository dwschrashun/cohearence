function checkCategory() {

    var category = $('.watch-info-tag-list').filter(function () {
        var $this = $(this);
        var $h4 = $this.siblings('h4');
        return $h4.text().trim() === 'Category';
    }).find('li a').text();
    if (category === "Music") {
        sendSong();
    }
    else {
        var titles = $("h4.title").map(function () {
            var element = $(this);
            return element.text().trim();
        });
        if ($.makeArray(titles).indexOf("Music") > -1) sendSong();
    }
}

function findTitleAndArtistAndVidTitle() {
    var videoTitle = $("#eow-title").text().trim();
    if (videoTitle.indexOf('-') !== -1) {
    	var artist = videoTitle.split(" - ")[0];
    	var songTitle = videoTitle.split(" - ")[1];
    	return [songTitle, artist, videoTitle];
    }
    var titleAndArtist = $('.watch-meta-item').filter(function () {
        var $this = $(this);
        var $h4 = $this.children('h4');
        return $h4.text().trim() === "Music";
    }).find("ul li").text().split("\"");
    if (titleAndArtist.length >= 2) {
        var songTitle = titleAndArtist[1];
        var byArtist = titleAndArtist[2].split("(")[0];
        var artist = byArtist.substring(3).trim();
        return [songTitle, artist, videoTitle];
    }
    return ["unknown title", "unknown artist", videoTitle];
}

function sendSong() {
    var youtubeId = location.href.split('watch?v=')[1].split('&list=')[0];
    var titleAndArtistAndVidTitle = findTitleAndArtistAndVidTitle();
    var songObj = {
        action: 'scrobble',
        message: "YouTube",
		source: {
	        url: youtubeId,
	        videoTitle: titleAndArtistAndVidTitle[2],
			domain: "YouTube",
			sourceUrl: location.href
		},
        category: 'Music',
        duration: $('.ytp-time-duration').text(),
        title: titleAndArtistAndVidTitle[0],
        artist: titleAndArtistAndVidTitle[1]
    };
    chrome.runtime.sendMessage(songObj, function (response) {
        console.log('response from router:', response);
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'newSongLoaded') {
        console.log("newSongLoaded in yt cs", request);
        setTimeout(function () {
            checkCategory();
            sendResponse({response: "request received, will crawl dom"});
        }, 1000);
    }
});
