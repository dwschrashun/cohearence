// console.log('loaded router');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// console.log('sender: ', sender);
	// console.log('request object', request);
	if (request.message === 'youtubeSong') {
		sendSong(request);
		sendResponse({response: "hey we got your song at the router"});
	}
	return true;
});

function sendSong (songObj) {
	console.log('sending song AJAX');
	$.ajax({
		url: "http://localhost:1337/api/users/560dc34df85c82d826e9197c/library",
		method: 'PUT',
		data: songObj,
		dataType: "json"
	}).done(function (response) {
		console.log("response from server", response);
	}).fail(function (error) {
		console.log(error);
	});
}
