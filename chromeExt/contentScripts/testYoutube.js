// [].forEach.call($('.watch-info-tag-list'), function(el) {
// 	console.log(el.children());
// 	// var titleElem = el.siblings();
// 	var child = this.children()[0].children()[0];

// })

// [].forEach.call($('.watch-meta-item'), function(elem) {

// 	console.log(elem.children());
// })

function checkCategory () {
	var category = $('.watch-info-tag-list').filter(function () {
		var $this = $(this);
	  	var $h4 = $this.siblings('h4');
	  	return $h4.text().trim() === 'Category';
	}).find('li a').text();
	if (category === "Music") {
		return sendSong();
	}
}

function findTitleAndArtist() {

	var titleAndArtist = $('.watch-meta-item').filter(function() {
		var $this = $(this);
		var $h4 = $this.children('h4');
		return $h4.text().trim() === "Music";
	}).find("ul li").text().split("\"");
	var songTitle = titleAndArtist[1];
	//var artist = titleAndArtist.substring(titleAndArtist.indexOf("by" + 3)).split("(")[0];
	var byArtist = titleAndArtist[2].split("(")[0];
	var artist = byArtist.substring(3).trim();
	return [songTitle, artist];
}



function sendSong() {
	console.log('sending');
	var titleAndArtist = findTitleAndArtist();	
	var songObj = {
	    href: location.href,
	    videoTitle: $("#eow-title").text().trim(),
	    category: 'Music',
	    duration: $('.ytp-time-duration').text(),
	    songTitle: titleAndArtist[0],
	    artist: titleAndArtist[1]
	};
	console.log('the object', songObj);
	chrome.runtime.sendMessage(songObj, function (response) {
	    // console.log('response from router:', response);
	});
	return songObj;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("content script request", request);
	if (request === 'newSongLoaded') {
		return checkCategory();
	}
	return false;
}
