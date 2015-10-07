window.onload = function () {
    chrome.storage.sync.get("user", function (user) {
        console.log('user', user);
        if (user.user) {
            $.ajax({
                url: 'http://localhost:1337/api/users/' + user.user._id + '/library',
                method: 'GET',
                dataType: "json"
            }).done(function (response) {
                console.log('ajax response', response);
                chrome.storage.sync.set({user: response}, function () {
                    console.log("new saved user", response);
                });
            }).fail(function (error) {
                console.log(error);
            });
        } else {
        	console.log('user not logged in probably should do something about that');
        }
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'YouTube') {
        sendSong(request);
        sendResponse({
            response: "hey we got your song at the router"
        });
    }
    if (request.message === 'Soundcloud') {
        sendSong(request);
        sendResponse({
            response: "hey we got your song at the router"
        });
    }
    if (request.message === 'Bandcamp') {
        sendSong(request);
        sendResponse({
            response: "hey we got your song at the router"
        });
    }
    return true;
});

function sendSong(songObj) {
    console.log("sending");
	chrome.storage.sync.get('user', function (user) {
		console.log("user pre-library put:", user);
	    if (!user.user._id) {
	    	console.log('there is no user logged in');
	    	return;
	    }
	    $.ajax({
	        url: "http://localhost:1337/api/users/" + user.user._id + "/library",
	        method: 'PUT',
	        data: songObj,
	        dataType: "json"
	    }).done(function (response) {
	        console.log("New music library from server: ", response);
	        user.user.musicLibrary = response;
	        chrome.storage.sync.set({user: user.user}, function () {
	        	console.log('user music library updated on chrome storage');
	        });
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
    // console.log("state updated: previousUrl, new url:", previousUrl, details.url);
    if (previousUrl) {
        //  	chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
        // 		var port = chrome.tabs.connect(tabArray[0].id, {name: "ytConnect"});
        //  		console.log("sending");
        // 		port.postMessage({message: "newSongLoaded"});
        // 		});
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            console.log("in tabs", tabs);
			console.log('tab 0: ',tabs[0]);
            chrome.tabs.sendMessage(tabs[0].id, {
                message: "newSongLoaded"
            }, {}, function (response) {
				console.log('response:', response);
                previousUrl = undefined;
                //console.log("response in newSongLoaded emitter", response);
            });
        });
    } else {
        previousUrl = details.url;
    }
});
