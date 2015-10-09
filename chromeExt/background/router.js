var backgroundDoc;
var youtubePlayer;
var soundcloudVideo;
var bandcampVideo;
var serviceMethods = {};

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
}

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

  return true;
});

function sendSong(songObj) {
  var user = getUser();
  console.log('sendsong', user);
  if (user) {
    $.ajax({
      url: "http://localhost:1337/api/users/" + user._id + "/library",
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
    })
  }
}
