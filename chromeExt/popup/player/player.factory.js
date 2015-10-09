app.factory("PlayerFactory", function($http) {
	var factory = {};
	
	factory.getVideoId = function(songObj){
		var indexOfBeginning;
		//TODO add other services
		if (songObj.source.domain === 'YouTube') {
			return songObj.source.url.split('watch?v=')[1];
		}
		else if (songObj.soundCloud.url) console.log('fix this l8r');
	};
	
	factory.setCurrentService = function (playerStates) {
        var playing = [];
        var playerStates = playerStates.response;
        for (var key in playerStates) {
            if (playerStates[key]) {
                playing.push(key);
            }
        }
        if (playing.length > 1) {
            chrome.runtime.sendMessage('killPlayers', function (response) {
                console.log(response);
                return null;
            });
        } else if (playing.length === 0) {
            return null;
        } else {
            return playing[0];
        }
    };

	return factory;
});
