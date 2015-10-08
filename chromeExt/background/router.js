var backgroundDoc;
var youtubePlayer;
var soundcloudVideo;
var serviceMethods = {};

window.onload = function () {
  backgroundDoc = $(chrome.extension.getBackgroundPage().document);
  soundcloudVideo = backgroundDoc.find('#soundcloudPlayer');

  chrome.storage.sync.get("user", function (user) {
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
        console.error(error);
      });
    } else {
      console.log('user not logged in probably should do something about that');
    }
  });
  createYouTubeVideo();
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

    if (request.message === 'Spotify') {
        sendSong(request);
        sendResponse({
            response: "hey we got your song at the router"
        });
    }

    if (request.message === 'playerAction') {
        var service = serviceMethods[request.service];
        var self = service.reference;
        var action = service[request.action];
        action.call(self);
    }

    if (request.message === "cue") {
        stopAllVideos();
        if (request.service === 'YouTube') {
            console.log("cue received", youtubePlayer);
            youtubePlayer.cueVideoById(request.id);
        }
        if (request.service === 'Soundcloud') {
            console.log('soundcloud song received', request);
            createSoundcloudVideo(request.id);
        }
    }

    if (request.message === "unMute") {
        console.log("unMute received", youtubePlayer);
        youtubePlayer.unMute();
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
	        user.user.musicLibrary = response;
	        chrome.storage.sync.set({user: user.user}, function () {
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
            chrome.tabs.sendMessage(tabId, {message: "newSongLoaded"}, {}, function (response) {
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
                else {
                    console.log("crawling DOM due to only one request", tab);
                    chrome.tabs.sendMessage(tabId, {message: "newSongLoaded"}, {}, function (response) {
                        console.log("response in newSongLoaded emitter", response);
                    });
                }
            }, 1000);
        }
    }
});

function createYouTubeVideo() {
    var tag = $('<script></script>');
    tag.attr('src', "https://www.youtube.com/iframe_api");
    var firstScriptTag = $(backgroundDoc.find('script')[0]);
    tag.insertBefore(firstScriptTag);
    youtubePlayer = backgroundDoc.find("#youtubePlayer");
    setTimeout(() => {
        youtubePlayer = new YT.Player(youtubePlayer[0], {
            height: '390',
            width: '640',
            events: {
                "onReady": onPlayerReady
                // "onStateChange": onPlayerStateChange
            }
        });
    }, 800);

    function onPlayerReady(event) {
        serviceMethods.YouTube = {
            play: youtubePlayer.playVideo,
            pause: youtubePlayer.pauseVideo,
            reference: youtubePlayer
        };
    }
}

function createSoundcloudVideo(songUrl) {
    SC.initialize({
        client_id: '68b135c934141190c88c1fb340c4c10a'
    });
    var streamTrack = function (track) {
        console.log('soundcloudVideo', soundcloudVideo);
        return SC.stream('/tracks/' + track.id).then(function (player) {
            $.ajax({
                method: 'get',
                url: track.stream_url + "s?client_id=68b135c934141190c88c1fb340c4c10a"
            }).done(function (response) {
                console.log('soundcloudVid', soundcloudVideo);
                soundcloudVideo.attr('src', response.http_mp3_128_url);
                soundcloudVideo[0].play();
                serviceMethods.Soundcloud = {
                    play: soundcloudVideo[0].play,
                    pause: soundcloudVideo[0].pause,
                    reference: soundcloudVideo[0]
                };
            });
        }).catch(function () {
            console.error(arguments);
        });
    };
    SC.resolve(songUrl).then(streamTrack);
}

function stopAllVideos() {
    if (youtubePlayer) youtubePlayer.stopVideo();
    if (soundcloudVideo[0]) soundcloudVideo[0].pause(); // Video tags have no stop method;
}
