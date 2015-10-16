chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

      //on all player or scrobbler messages
      if (request.action) {

          //get rid of this you asshole
          var playerStates = getPlayerState();
          var playing = false;
          for (var key in playerStates) {
              if (playerStates[key]) {
                  playing = true;
              }
          }
          if (request.action === 'killPlayers') stopAllVideos();
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
              setIcon(request.action !== "pause", "player");
              if (request.service === 'YouTube') {
                console.log('about2pause', request);
                socket.emit(request.action, {service: 'YouTube'});
                return;
              }
              var service = serviceMethods[request.service];
              var self = service.reference;
              var action = service[request.action];
              console.log(request);
              action.call(self);
          }

          if (request.message === "cue") {
              currentSongIndex = request.songIndex;
              stopAllVideos();
              cueSong(request);
              setIcon(true, "player");
              sendResponse({
                message: 'time 2 play dat song'
              })
          }

          // persisting controls on popup close
          if (request.message === "whoIsPlaying") {
              sendResponse({
                  response: playerStates,
                  currentIndex: currentSongIndex
              });
          }
      }

      // changing songs
      if (request.message === 'changeSong') {
          console.log("changing song:", request.direction);
          var nextSong = autoPlayNextSong(request.direction);
          cueSong(nextSong);
          sendResponse({
            nextSongIndex: currentSongIndex,
            nextSong: nextSong
          });
      }

      //if checking time of video
      if (request.message === "checkTimeAction") {
          var service = request.service;
          var currentTime = getCurrentTime(service);
          console.log('CURRENTTIME', currentTime)
          // setTimeout(function() {
            sendResponse({
              currentTime: currentTime[0],
              duration: currentTime[1]
            })
          // }, 3000)

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
    //console.log("tab updateed", tab.url);

    var isLibrary = ["http://localhost:1337/library", "http://127.0.0.1:1337/library", "http://aqueous-gorge-7560/library"].some(function (el) {
        return el === tab.url;
    });
    if (tab.url.indexOf('https://www.youtube.com/watch') !== -1 && changeInfo && changeInfo.status == "complete") {
        scrobbleYouTube(tabId);
    }
    if (isLibrary && changeInfo && changeInfo.status == "complete") {
        setLibraryHandlers(tabId);
    }
});
