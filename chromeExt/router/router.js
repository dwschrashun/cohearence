chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === 'youtubeSong') {
		sendSong(request);
		sendResponse({response: "hey we got your song at the router"});
	}
	return true;
});

function sendSong (songObj) {
	var userId;
	$.ajax({
	    url: "http://localhost:1337/api/users/",
	    method: "GET"
	}).done(function (users) {
	    userId = users[0]._id;
		$.ajax({
			url: "http://localhost:1337/api/users/" + userId + "/library",
			method: 'PUT',
			data: songObj,
			dataType: "json"
		}).done(function (response) {
			console.log("response from server", response);
		}).fail(function (error) {
			console.log(error);
		});
	}).fail(function (error) {
	    console.log("Error getting users", error);
	});
}

