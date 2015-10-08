app.factory('PlaylistFactory', function($http) {

	function makePlaylist(name){
		return $http.post('/api/playlists', {name: name})
		.then(function(response){
			return response.data;
		});
	}

	function addToPlaylist(songId, playlistId) {
		return $http.put('/api/playlists', {song: songId, playlist: playlistId})
		.then(function(response){
			return response.data;
		});
	}

	function getPlaylists(){
		return $http.get('/api/playlists/user')
		.then(function(response){
			return response.data;
		});
	}

	return {
		addToPlaylist: addToPlaylist,
		makePlaylist: makePlaylist,
		getPlaylists: getPlaylists
	};
});
