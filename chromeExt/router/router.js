window.onload = function () {
    chrome.storage.sync.get("user", function (user) {
        console.log('user', user);
        if (user.user) {
            $.ajax({
                url: 'http://localhost:1337/api/users/' + user.user._id + '/library',
                method: 'GET',
                dataType: "json"
            }).done(function (response) {
                chrome.storage.sync.set({
                    user: response
                }, function () {});
            }).fail(function (error) {
                console.log(error);
            });
        } else {
            console.log('user not logged in probably should do something about that');
        }
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('THIS IS THE REQUEST GODDAMMIT', request);
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
    if (request.message === 'Spotify') {
        sendSong(request);
        sendResponse({
            response: "hey we got your song at the router"
        });
    }
    // return true;
});

function sendSong(songObj) {
    // console.log("sending");
    chrome.storage.sync.get('user', function (user) {
        // console.log("user pre-library put:", user);
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
            // console.log("New music library from server: ", response);
            user.user.musicLibrary = response;
            chrome.storage.sync.set({
                user: user.user
            }, function () {
                // console.log('user music library updated on chrome storage');
            });
        }).fail(function (error) {
            console.log(error);
        });
    });
}

var counter = 0;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status == "complete") {
        if (tab.url.indexOf('https://www.youtube.com/watch') !== -1) {
            counter++;
            console.log('url changed', counter);
            if (counter == 2) {
                console.log("Tab updated: ", tab.url, ' sending message', counter, 'tabId', tabId);
                chrome.tabs.sendMessage(tabId, {
                    message: "newSongLoaded"
                }, {}, function (response) {
                    console.log("response in newSongLoaded emitter", response);
                });
                counter = 0;
            }
        }
    }
});

// chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
//     // console.log("state updated: previousUrl, new url:", previousUrl, details.url);
//     if (previousUrl !== details.url) {
//         //      chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
//         //      var port = chrome.tabs.connect(tabArray[0].id, {name: "ytConnect"});
//         //          console.log("sending");
//         //      port.postMessage({message: "newSongLoaded"});
//         //      });
//         chrome.tabs.query({
//             active: true,
//             currentWindow: true
//         }, function (tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, {
//                 message: "newSongLoaded"
//             }, {}, function (response) {
//                 // console.log('response:', response);
//                 previousUrl = details.url;
//                 //console.log("response in newSongLoaded emitter", response);
//             });
//         });
//     } else {
//         previousUrl = details.url;
//     }
// });
