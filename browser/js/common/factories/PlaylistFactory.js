app.factory('PlaylistFactory', function($http) {

	function makePlaylist(name){
		return $http.post('/api/playlists', {name: name})
		.then(response => response.data);
	}

	function addToPlaylist(songId, playlistId) {
		return $http.put('/api/playlists', {song: songId, playlist: playlistId})
		.then(response => response.data);
	}

	function removeFromPlaylist(playlistId, songId){
		return $http.delete('/api/playlists/' + playlistId + '/' + songId)
		.then(response => response.data);
	}

	function getPlaylists(){
		return $http.get('/api/playlists/user')
		.then(response => response.data);
	}

	function getPopulatedPlaylist (id) {
		return $http.get("/api/playlists/" + id).then(response => response.data);
	}

	function deletePlaylist(id){
		return $http.delete("/api/playlists/" + id).then(response => response.data);
	}

	return {
		addToPlaylist,
		makePlaylist,
		getPlaylists,
		getPopulatedPlaylist,
		deletePlaylist,
		removeFromPlaylist,
	};
});
