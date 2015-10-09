app.factory("PlayerFactory", function($http) {
	var factory = {};
	
	factory.getVideoId = function(songObj){
		return songObj.source.url.split('watch?v=')[1];
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
