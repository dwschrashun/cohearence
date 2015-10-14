app.factory("SongFactory", function(){

	function setSourceIcons(song){
		console.log(song);
		switch (song.source.domain) {
			case "Soundcloud":
				song.sourceImage = "soundcloud-landing.png";
				break;
			case "YouTube":
				song.sourceImage = "youtube-landing.png";
				break;
			case "Spotify":
				song.sourceImage = "spotify-landing.png";
				break;
			case "Bandcamp":
			song.sourceImage = "bandcamp-landing.png";
				break;
			default:
			song.sourceImage = null;
		}
	}

	return {
		setSourceIcons: setSourceIcons
	};
});
