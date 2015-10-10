

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
      url: environment.server + "/api/users/" + user._id + '/library',
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'scrobble') {
    sendSong(request);
    sendResponse({
        response: "hey we got your song at the router from:" + request.message
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

  if (request.message === "getEnv") {
    console.log("getting env:", environment);
    sendResponse(environment);
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
      url: environment.server + "/api/users/" + user._id + "/library",
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
