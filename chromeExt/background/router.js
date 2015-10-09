var backgroundDoc;
var youtubePlayer;
var soundcloudVideo;
var bandcampVideo;
var serviceMethods = {};

window.onload = function () {
  backgroundDoc = $(chrome.extension.getBackgroundPage().document);
  soundcloudVideo = backgroundDoc.find('#soundcloudPlayer');
  bandcampVideo = backgroundDoc.find('#bandcampPlayer');
  createYouTubeVideo();

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
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'scrobble') {
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
      cueSong(request);
  }

  if (request.message === "ytCall") {
   // getYouTubeUrl(request.title, request.artist);
   //  console.log("yt id in router:", id);
   //  sendResponse({response: id});
    var q = `${request.artist} - ${request.title}`;
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      type: 'video',
      videoCategoryId: "Music"
    });
    request.execute(function(response) {
      var id = response.result.items[0].id.videoId;
      console.log("video id to send to router", id);
      sendResponse(id);
    });
  }

  return true;
});

function sendSong(songObj) {
	chrome.storage.sync.get('user', function (user) {
		console.log("user pre-library put:", user);
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
          console.log("updated library:", response);
	        user.user.musicLibrary = response;
	        chrome.storage.sync.set({user: user.user}, function () {
	        });
	    }).fail(function (error) {
	        console.log(error);
	    });
	});
}
