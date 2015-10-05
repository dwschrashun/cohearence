var user;

window.onload = function() {
	chrome.storage.sync.get("user", function (user) {
		if (user._id) {
			$.ajax({
				url: "http://localhost:1337/api/users/" + user._id,
				method: 'GET',
				dataType: "json"
			}).done(function (response) {
				console.log("user from database", response);
				chrome.storage.sync.set({user: response}, function (savedUser) {
					console.log("new saved user", savedUser);
				});
			}).fail(function (error) {
				console.log(error);
			});
		}
	});
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === 'youtubeSong') {
		sendSong(request);
		sendResponse({response: "hey we got your song at the router"});
	}
	if (request.message === 'soundCloudSong') {
		sendSong(request);
		sendResponse({response: "hey we got your song at the router"});
	}
	return true;
});

function sendSong (songObj) {
	chrome.storage.sync.get("user", function(userObj) {
		console.log('this is the ajax user', userObj);
		if (!userObj) return;
		$.ajax({
			url: "http://localhost:1337/api/users/" + userObj.user._id + "/library",
			method: 'PUT',
			data: songObj,
			dataType: "json"
		}).done(function (response) {
			console.log("End of the line: response from server", response);
		}).fail(function (error) {
			console.log(error);
		});
	});
}

// chrome.webNavigation.onCompleted.addListener(function (details) {
//     console.log("On completed", details);
// });

var previousUrl = true;

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    console.log("state updated: previousUrl, new url:", previousUrl, details.url);
    if (previousUrl) {
   //  	chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
  	// 		var port = chrome.tabs.connect(tabArray[0].id, {name: "ytConnect"});
   //  		console.log("sending");
  	// 		port.postMessage({message: "newSongLoaded"});
   // 		});
	    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	    	console.log("in tabs", tabs);
		    chrome.tabs.sendMessage(tabs[0].id, {message: "newSongLoaded"}, {}, function (response) {
				previousUrl = undefined;
			    //console.log("response in newSongLoaded emitter", response);
			});
	    });
	}
	else {
		previousUrl = details.url;
	}
});
