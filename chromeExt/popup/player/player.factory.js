app.factory("PlayerFactory", function($http) {

	var factory = {};
	factory.getVideoId = function(songObj){
		var indexOfBeginning;
		//TODO add other services
		console.log('songObj', songObj);
		if (songObj.source.domain === 'YouTube') {
			return songObj.source.url.split('watch?v=')[1];
		}
		else if (songObj.soundCloud.url) console.log('fix this l8r');
	}

	return factory;
})
