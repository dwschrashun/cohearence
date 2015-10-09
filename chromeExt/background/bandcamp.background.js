function createBandcampVideo(trackSrc) {
  var theVideo = bandcampVideo[0];
  bandcampVideo.attr('src', trackSrc);
  theVideo.play();
  serviceMethods.Bandcamp = {
    play: theVideo.play,
    pause: theVideo.pause,
    reference: theVideo
  }
}
