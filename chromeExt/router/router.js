// console.log('loaded router');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('sender: ', sender);
	if (request === 'gotSong') {
		sendResponse({response: "hey we got your song at the router"});
	}
	return true;
});
