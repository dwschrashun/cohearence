chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

      //on all player or scrobbler messages
      if (request.action) {

          var playerStates = getPlayerState();
          var playing = false;
          for (var key in playerStates) {
              if (playerStates[key]) {
                  playing = true;
              }
          }
          if (request.action === 'killPlayers') {
    			  stopAllVideos();
    			  sendResponse({
    				  response: "killed the videos"
    			  });
		      }
          //if scrobbling
          if (request.action === 'scrobble') {
              sendSong(request);
              setIcon(playing, "scrobble");
              sendResponse({
                  response: "hey we got your song at the router from:" + request.message
              });
          }

          //if making player perform some action (play, pause, etc.)
          if (request.message === 'playerAction') {
              currentService = request.service;
              setIcon(request.action !== "pause", "player");
              var service = serviceMethods[request.service];
              var self = service.reference;
              var action = service[request.action];
              action.call(self);
          }

          //if cueing video
          if (request.message === "cue") {
              currentService = request.service;
              currentSongIndex = request.songIndex;
              stopAllVideos();
              cueSong(request);
              setIcon(true, "player");
          }

          // persisting controls on popup close and retrieving environment vars
          if (request.message === "whoIsPlaying") {
            var currentSong = getCurrentSong(currentSongIndex);
              sendResponse({
                  response: playerStates,
                  currentIndex: currentSongIndex,
                  currentSong: currentSong,
                  currentService: currentService,
                  environment: environment
              });
          }
      }

      //retrieving environment variables
      if (request.message === 'environmentAction') {
        console.log('environment!', environment);
        sendResponse({
          environment: environment
        })
      }

      // changing songs
      if (request.message === 'changeSong') {
          var nextSong = autoPlayNextSong(request.direction);
          cueSong(nextSong);
          var nextSongObj = getCurrentSong(currentSongIndex);
          sendResponse({
            nextSongIndex: currentSongIndex,
            nextSong: nextSong,
            nextSongObj: nextSongObj
          });
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
      if (request.message === "changeTimeAction") {
          var service = request.service;
          seekTo(request.time, service);
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
          request.execute(function (response) {
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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    var isLibrary = ["http://localhost:1337/library", "http://127.0.0.1:1337/library", "http://aqueous-gorge-7560/library"].some(function (el) {
        return el === tab.url;
    });
    if (tab.url.indexOf('https://www.youtube.com/watch') !== -1 && changeInfo && changeInfo.status == "complete") {
        scrobbleYouTube(tabId);
    }
});
