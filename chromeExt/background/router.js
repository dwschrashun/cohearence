chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request in router:", request);
  //if scrobbling
  if (request.action === 'scrobble') {
    sendSong(request);
    sendResponse({
        response: "hey we got your song at the router from:" + request.message
    });
  }

  //if making player perform some action (play, pause, etc.)
  if (request.message === 'playerAction') {
	  console.log('GOT THE REQUEST', request);
	  console.log("SERVICE METHODS: ",serviceMethods);
    var service = serviceMethods[request.service];
    var self = service.reference;
    var action = service[request.action];
    action.call(self);
  }

  // changing songs
  if (request.message === 'changeSong') {
    var nextSongRequest = autoPlayNextSong(request.direction);
    cueSong(nextSongRequest);
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

  //if changing time in video with slider
  if (request.message === "changeTimeAction"){
    var service = request.service;
    seekTo(request.time, service);
  }

  //if cueing video
  if (request.message === "cue") {
      console.log("request in cue", request);
      currentSongIndex = request.songIndex;
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
