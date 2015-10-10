

console.log('localstorage!', localStorage);

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
  console.log('onload', user);
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
      console.log("REQUEST in router:", request);
      var service = serviceMethods[request.service];
      console.log("SERVICE in router:", service);
      var self = service.reference;
      var action = service[request.action];
      action.call(self);
  }
  if (request.message === "cue") {
    console.log("REQUEST on cue:", request);
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
  if (request.message === "getEnv") {
    console.log("getting env:", environment);
    sendResponse(environment);
  }
  return true;
});

function sendSong(songObj) {
  var user = getUser();
  console.log('sendsong', songObj);
  if (user) {
    $.ajax({
      url: environment.server + "/api/users/" + user._id + "/library",
      method: 'PUT',
      data: songObj,
      dataType: "json"
    })
    .done(function(response) {
      console.log('AJAX RESPONSE', response);
      setUser(response);
    })
    .fail(function(error) {
      console.log(error);
    });
  }
}
