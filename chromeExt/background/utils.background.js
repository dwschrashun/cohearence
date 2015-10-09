
function cueSong(request) {
  if (request.service === 'YouTube') {
    youtubePlayer.loadVideoById(request.id);
  }
  if (request.service === 'Soundcloud') {
    createSoundcloudVideo(request.id);
  }
  if (request.service === 'Bandcamp') {
    createBandcampVideo(request.id);
  }
}

function stopAllVideos() {
    if (youtubePlayer) youtubePlayer.stopVideo();
    if (soundcloudVideo[0]) soundcloudVideo[0].pause();
    if (bandcampVideo[0]) bandcampVideo[0].pause();
}
