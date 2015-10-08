var player;

window.onload = function () {
    chrome.storage.sync.get("user", function (user) {
        //console.log('user', user);
        if (user.user) {
            $.ajax({
                url: 'http://localhost:1337/api/users/' + user.user._id + '/library',
                method: 'GET',
                dataType: "json"
            }).done(function (response) {
                //console.log('ajax response', response);
                chrome.storage.sync.set({user: response}, function () {
                    //console.log("new saved user", response);
                });
            }).fail(function (error) {
                console.log(error);
            });
        } else {
        	console.log('user not logged in probably should do something about that');
        }
    });

    var backgroundDoc = chrome.extension.getBackgroundPage().document;
    var tag = backgroundDoc.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = backgroundDoc.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    player = backgroundDoc.getElementById("player");
    setTimeout(() => {
      player = new YT.Player(player, {
        height: '390',
        width: '640',
        // videoId: 'H_IcrHMbb8M',
        events: {
            // "onReady": onPlayerReady,
            // "onStateChange": onPlayerStateChange
        }
      });
      //console.log("player on first open:", player);
    }, 800);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //console.log("REQUEST received:", request);
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

    if (request.message === "play") {
        console.log("play received", player);
        player.playVideo();
    }

    if (request.message === "pause") {
        player.pauseVideo();
    }

    if (request.message === "cue") {
        console.log("cue received", player);
        player.cueVideoById(request.id);
    }

    if (request.message === "unMute") {
        console.log("unMute received", player);
        player.unMute();
    }

    if (request.message === "test") {
        console.log("test received", player);
        console.log(player.getCurrentTime());
    }

    return true;
});

function sendSong(songObj) {
	chrome.storage.sync.get('user', function (user) {
		//console.log("user pre-library put:", user);
	    if (!user && !user.user && !user.user._id) {
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
	        	//console.log('user music library updated on chrome storage');
	        });
	    }).fail(function (error) {
	        console.log(error);
	    });
	});
}

// var prevYouTube = false;
var lastLoadTime = 0;
var quickDraw = false;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //console.log("tab updateed", tab.url);       
    if (tab.url.indexOf('https://www.youtube.com/watch') !== -1 && changeInfo && changeInfo.status == "complete") {
        var newLoadTime = new Date () / 1000;
        var timeSinceLastLoad = newLoadTime - lastLoadTime;
        //console.log("New page request: new, last, diff", newLoadTime, lastLoadTime, timeSinceLastLoad);
        if (timeSinceLastLoad === newLoadTime || timeSinceLastLoad < 0.1) {
            lastLoadTime = newLoadTime;
            // prevYouTube = tab.url
            //console.log("Tab updated: ", tab.url, ' sending message', timeSinceLastLoad, 'tabId', tabId);
            console.log("crawling DOM due to low time diff / first load:", tab);
            quickDraw = true;
            chrome.tabs.sendMessage(tabId, {
                message: "newSongLoaded"
            }, {}, function (response) {
                console.log("response in newSongLoaded emitter", response);
            });
            setTimeout(function () {
                quickDraw = false;
            }, 3000);
        }
        else {
            lastLoadTime = newLoadTime;
            setTimeout(function () {
                if (quickDraw) return;
                else console.log("crawling DOM due to only one request", tab);
            }, 1000);

        }
    }
});


// chrome.webNavigation.onCompleted.addListener(function (details) {
//     console.log("On completed", details);
// });

// var previousUrl = true;

// chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
//     // console.log("state updated: previousUrl, new url:", previousUrl, details.url);
//     if (previousUrl) {
//         //  	chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
//         // 		var port = chrome.tabs.connect(tabArray[0].id, {name: "ytConnect"});
//         //  		console.log("sending");
//         // 		port.postMessage({message: "newSongLoaded"});
//         // 		});
//         chrome.tabs.query({
//             active: true,
//             currentWindow: true
//         }, function (tabs) {
//             console.log("in tabs", tabs);
// 			console.log('tab 0: ',tabs[0]);
//             chrome.tabs.sendMessage(tabs[0].id, {
//                 message: "newSongLoaded"
//             }, {}, function (response) {
// 				console.log('response:', response);
//                 previousUrl = undefined;
//                 //console.log("response in newSongLoaded emitter", response);
//             });
//         });
//     } else {
//         previousUrl = details.url;
//     }
// });
