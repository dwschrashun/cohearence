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
	if (titleAndArtist.length >= 2) {
		var songTitle = titleAndArtist[1];
		var byArtist = titleAndArtist[2].split("(")[0];
		var artist = byArtist.substring(3).trim();
		return [songTitle, artist];
	}
	return ['', ''];
}

function sendSong() {
	var titleAndArtist = findTitleAndArtist();
	var songObj = {
		message: 'youtubeSong',
	    url: location.href,
	    videoTitle: $("#eow-title").text().trim(),
	    category: 'Music',
	    duration: $('.ytp-time-duration').text(),
	    title: titleAndArtist[0],
	    artist: titleAndArtist[1]
	};
	chrome.runtime.sendMessage(songObj, function (response) {
	    console.log('response from router:', response);
	});
}

// $(document).on('transitionend', function(e) {
//     if (e.target.id === 'progress')
//         console.log('hey');
// });

checkCategory();

var headTitle = $('head > title').textContent;
console.log(headTitle);
