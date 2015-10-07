app.factory("PlayerFactory", function($http) {

	var factory = {};
	factory.getVideoId = function(songObj){
		var indexOfBeginning;
		//TODO add other services
		console.log('songObj', songObj);
		if (songObj.source.domain === 'YouTube') {
			indexOfBeginning = songObj.source.url.indexOf("v=");
			return songObj.source.url.slice(indexOfBeginning+2);
		}
		else if (songObj.soundCloud.url) console.log('fix this l8r');
	}

	return factory;
})
