var backgroundDoc;
var youtubePlayer;
var soundcloudVideo;
var bandcampVideo;
var serviceMethods = {};

function getUser() {
  return JSON.parse(localStorage.getItem("cohearenceUser"));
}

function setUser(library) {
  var theUser = getUser();
  theUser.musicLibrary = library;
  var stringifiedUpdatedUser = JSON.stringify(theUser);
  localStorage.setItem("cohearenceUser", stringifiedUpdatedUser);
}

function getBackendUserAndUpdateLocalStorage() {
  var user = getUser();
  if (user) {
    $.ajax({
      url: 'http://localhost:1337/api/users/' + user._id + '/library',
      method: 'GET',
      dataType: "json"
    })
    .done(function (response) {
      setUser(response);
    })
    .fail(function (error) {
      console.error(error);
    });
  } else {
    console.log('user not logged in probably should do something about that');
  }
}

window.onload = function () {
  backgroundDoc = $(chrome.extension.getBackgroundPage().document);
  soundcloudVideo = backgroundDoc.find('#soundcloudPlayer');
  bandcampVideo = backgroundDoc.find('#bandcampPlayer');
  createYouTubeVideo();
  //get user from backend and update in local storage if exists
  getBackendUserAndUpdateLocalStorage();
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  //if scrobbling
  if (request.action === 'scrobble') {
    sendSong(request);
    sendResponse({
        response: "hey we got your song at the router"
    });
  }

  //if making player perform some action (play, pause, etc.)
  if (request.message === 'playerAction') {
    var service = serviceMethods[request.service];
    var self = service.reference;
    var action = service[request.action];
    action.call(self);
  }

   //if checking time of video
  if (request.message === "checkTimeAction") {
    var service = request.service;
    var currentTime = getCurrentTime(service);
    sendResponse({
        currentTime: currentTime[0],
        duration: currentTime[1]
    });
  }

  //if cueing video
  if (request.message === "cue") {
      stopAllVideos();
      cueSong(request);
  }

  // persisting controls on popup close
  if (request === "whoIsPlaying") {
    var playerStates = getPlayerState();

    sendResponse({
      response: playerStates
    });
  }

  if (request.message === "ytCall") {
    // console.log('request to youtube', request);
    var q = `${request.artist} - ${request.title}`;
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      type: 'video',
      videoCategoryId: "Music"
    });
    request.execute(function(response) {
      var id = response.result.items[0].id.videoId;
      // console.log("video id to send to router", id);
      sendResponse(id);
    });
  }

  if (request.message === 'checkForStreamable') {
    SC.initialize({
        client_id: '68b135c934141190c88c1fb340c4c10a'
    });
    SC.resolve(request.song.source.url)
        .then(function (trackInfo) {
            if (trackInfo.streamable) {
                sendResponse(true);
            } else {
                sendResponse(false);
            }
        });
  }
  return true;
});

function sendSong(songObj) {
  var user = getUser();
  if (user) {
    $.ajax({
      url: "http://localhost:1337/api/users/" + user._id + "/library",
      method: 'PUT',
      data: songObj,
      dataType: "json"
    })
    .done(function(response) {
      setUser(response);
    })
    .fail(function(error) {
      console.log(error);
    });
  }
}
