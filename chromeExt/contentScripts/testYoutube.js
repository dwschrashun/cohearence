// [].forEach.call($('.watch-info-tag-list'), function(el) {
// 	console.log(el.children());
// 	// var titleElem = el.siblings();
// 	var child = this.children()[0].children()[0];

// })

// [].forEach.call($('.watch-meta-item'), function(elem) {

// 	console.log(elem.children());
// })

$('.watch-info-tag-list').filter(function () {
  var $this = $(this);
  var $h4 = $this.siblings('h4');
  return $h4.text().trim() === 'Category';
}).find('li a').text()

$('.watch-info-tag-list').each(function(idx, elem) {
	var child = $(this)[0].children[0].children[0];
	if (child && child.textContent === 'Music') {
		return sendSong();
	}
})
// var child = $('.watch-meta-item').children()[0]
// // console.log(child);
// 	if (child && child.text().trim() === 'Music') {
// 		//only send if they've listened to for certain time
// 		sendSong();
// 	}



function findTitleAndArtist() {

	$('.watch-meta-item').each(function(idx, elem) {
		var child = $(this)[0].children[0];
		console.log(child);
		if (child && child.textContent.trim() === 'Music') {
			//return text content of first child of second child of watch-meta-item
			var foundText = $(this)[0].children[1].children[0].textContent;
			var songTitle = foundText.split("\"");
			console.log(songTitle);
		}

		// .children()[0].text();
		// console.log(child);
	})
}

findTitleAndArtist();

function sendSong() {
	console.log('sending');
	var songObj = {
    href: location.href,
    title: $("#eow-title").text().trim(),
    category: 'Music',
    duration: $('.ytp-time-duration').text()
	};
	console.log('the object', songObj);
	chrome.runtime.sendMessage(songObj, function (response) {
	    console.log('response from router:', response);
	});
}
