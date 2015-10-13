// var prevYouTube = false;
var lastLoadTime = 0;
var quickDraw = false;

function scrobbleYouTube (tabId) {
    var newLoadTime = new Date () / 1000;
    var timeSinceLastLoad = newLoadTime - lastLoadTime;
    //console.log("New page request: new, last, diff", newLoadTime, lastLoadTime, timeSinceLastLoad);
    if (timeSinceLastLoad < 0.1) {
        lastLoadTime = newLoadTime;
        // prevYouTube = tab.url
        //console.log("Tab updated: ", tab.url, ' sending message', timeSinceLastLoad, 'tabId', tabId);
        // console.log("crawling DOM due to low time diff / first load:", tab);
        quickDraw = true;
        chrome.tabs.sendMessage(tabId, {message: "newSongLoaded"}, {}, function (response) {
            // console.log("response in newSongLoaded emitter", response);
        });
        setTimeout(function () {
            quickDraw = false;
        }, 3000);
    }
    else {
        lastLoadTime = newLoadTime;
        setTimeout(function () {
            if (quickDraw) return;
            else {
                // console.log("crawling DOM due to only one request", tab);
                chrome.tabs.sendMessage(tabId, {message: "newSongLoaded"}, {}, function (response) {
                    console.log("response in newSongLoaded emitter", response);
                });
            }
        }, 1000);
    }  
}
