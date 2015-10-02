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

// chrome.webNavigation.onCompleted.addListener(function (details) {
//     console.log("On completed", details);
// });

var previousUrl;

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    // console.log("previousUrl, new url:", previousUrl, details.url);
    if (previousUrl) {
    	chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
  			var port = chrome.tabs.connect(tabArray[0].id, {name: "ytConnect"});
    		console.log("sending");
  			port.postMessage({message: "newSongLoaded"});
			previousUrl = undefined;
   		});
	}
	else {
		previousUrl = details.url;
	}



	  //   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	  //   	console.log("in tabs", tabs);
		 //    chrome.tabs.sendMessage(tabs[0].id, {message: "newSongLoaded"}, {}, function (response) {
			//     console.log("response in newSongLoaded emitter", response);
			// });
	  //   });
});