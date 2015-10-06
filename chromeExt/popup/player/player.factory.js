app.factory("PlayerFactory", function($http) {

	factory = {};

	factory.getVideoId = function(songObj){
		let indexOfBeginning;

		if (songObj.youtube.url) {
			indexOfBeginning = songObj.youtube.url.indexOf("v=");
			return songObj.youtube.url.slice(indexOfBeginning+2);
		}
		else if (songObj.soundCloud.url) console.log('fix this l8r');
	}

	return factory;
})
