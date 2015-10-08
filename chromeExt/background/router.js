var youtubePlayer;
var soundcloudVideo;
var serviceMethods = {};

window.onload = function () {
    chrome.storage.sync.get("user", function (user) {
        // console.log('user', user);
        if (user.user) {
            $.ajax({
                url: 'http://localhost:1337/api/users/' + user.user._id + '/library',
                method: 'GET',
                dataType: "json"
            }).done(function (response) {
                // console.log('ajax response', response);
                chrome.storage.sync.set({
                    user: response
                }, function () {
                    // console.log("new saved user", response);
                });
            }).fail(function (error) {
                console.error(error);
            });
        } else {
            // console.log('user not logged in probably should do something about that');
        }
    });
    createYouTubeVideo();
    createSoundcloudVideo();
};


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log("REQUEST received:", request);
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

    if (request.message === 'playerAction') {
        var service = serviceMethods[request.service];
        var self = service.reference;
        var action = service[request.action];
        action.call(self);
    }

    if (request.message === "cue") {
        console.log("cue received", youtubePlayer);
        youtubePlayer.cueVideoById(request.id);
    }

    if (request.message === "unMute") {
        console.log("unMute received", youtubePlayer);
        youtubePlayer.unMute();
    }

    return true;
});

function sendSong(songObj) {
    console.log("sending");
    chrome.storage.sync.get('user', function (user) {
        // console.log("user pre-library put:", user);
        if (!user.user._id) {
            // console.log('there is no user logged in');
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
            // console.log('url changed', counter);
            if (counter == 2) {
                // console.log("Tab updated: ", tab.url, ' sending message', counter, 'tabId', tabId);
                chrome.tabs.sendMessage(tabId, {
                    message: "newSongLoaded"
                }, {}, function (response) {
                    // console.log("response in newSongLoaded emitter", response);
                });
                counter = 0;
            }
        }
    }
});

function createYouTubeVideo() {
    var backgroundDoc = chrome.extension.getBackgroundPage().document;
    var tag = backgroundDoc.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = backgroundDoc.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    youtubePlayer = backgroundDoc.getElementById("youtubePlayer");
    setTimeout(() => {
        youtubePlayer = new YT.Player(youtubePlayer, {
            height: '390',
            width: '640',
            // videoId: 'H_IcrHMbb8M',
            events: {
                // "onReady": onPlayerReady,
                // "onStateChange": onPlayerStateChange
            }
        });
        // console.log('youtubePlayer', youtubePlayer);
        serviceMethods.YouTube = {
            play: youtubePlayer.playVideo,
            pause: youtubePlayer.pause,
            reference: youtubePlayer
        };
        // console.log(serviceMethods);
    }, 800);
}

function createSoundcloudVideo() {
    var backgroundDoc = $(chrome.extension.getBackgroundPage().document);
    soundcloudVideo = backgroundDoc.find('#soundcloudPlayer');
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
                soundcloudVideo.attr('src', response.http_mp3_128_url);
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
    var songUrl = 'https://soundcloud.com/axelsundell/50-cent-in-da-club';
    SC.resolve(songUrl).then(streamTrack);
}

