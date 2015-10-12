app.factory("PlayerFactory", function ($http, $rootScope) {
	var factory = {};

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

    factory.checkSoundcloudStreamable = function (song) {
        if (song.source.url.indexOf('soundcloud') === -1) {
            // console.log('not streamable', song);
            return false;
        }
        return true;
    };

    factory.getPlaylists = function () {
        return $http.get($rootScope.environment.server + '/api/playlists/user')
            .then(response => response.data);
    };

	return factory;
});
