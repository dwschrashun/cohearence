app.factory("SongFactory", function(){

	function setSourceIcons(song){
		switch (song.source.domain) {
			case "Soundcloud":
				song.sourceImage = "images/soundcloud-landing.png";
				break;
			case "YouTube":
				song.sourceImage = "images/youtube-landing.png";
				break;
			case "Spotify":
				song.sourceImage = "images/spotify-landing.png";
				break;
			case "Bandcamp":
			song.sourceImage = "images/bandcamp-landing.png";
				break;
			default:
			song.sourceImage = null;
		}
	}

	return {
		setSourceIcons: setSourceIcons
	};
});
