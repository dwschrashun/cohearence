function createBandcampVideo(trackSrc) {
  var theVideo = bandcampVideo[0];
  bandcampVideo.attr('src', trackSrc);
  console.log("BC theVideo, bandcampVideo:", theVideo, bandcampVideo.attr, trackSrc);
  theVideo.play();
  serviceMethods.Bandcamp = {
    play: theVideo.play,
    pause: theVideo.pause,
    reference: theVideo
  }
}
