function createBandcampVideo(trackSrc) {
  var theVideo = bandcampVideo[0];
  theVideo.onended = function () {
      var nextSong = autoPlayNextSong();
      console.log('playing next song', nextSong);
      cueSong(nextSong);
  };
  bandcampVideo.attr('src', trackSrc);
  console.log("BC theVideo, bandcampVideo:", theVideo, bandcampVideo.attr, trackSrc);
  theVideo.play();
  serviceMethods.Bandcamp = {
    play: theVideo.play,
    pause: theVideo.pause,
    reference: theVideo
  };
}
