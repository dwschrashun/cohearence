[].forEach.call(document.getElementsByClassName('watch-info-tag-list'), function(el) {
	var child = el.children[0];
	var child = el.children[0].children[0]
	if (child && child.textContent.trim() === 'Music') {
		sendSong();
	}

})

function sendSong() {
	var songObj = {
    href: location.href,
    title: document.getElementById("eow-title").textContent.trim(),
    category: 'Music',

	};

	chrome.runtime.sendMessage(songObj, function (response) {
	    console.log('response from router:', response);
	});
}
