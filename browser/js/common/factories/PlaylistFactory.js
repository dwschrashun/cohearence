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
			console.log("in factory",response.data);
			return response.data;
		});
	}

	function removeFromPlaylist(playlistId, songId){
		return $http.delete('/api/playlists/' + playlistId + '/' + songId)
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

	function getPopulatedPlaylist (id) {
		return $http.get("/api/playlists/" + id).then(function (response) {
			return response.data;
		});
	}

	function deletePlaylist(id){
		console.log(id);
		return $http.delete("/api/playlists/" + id).then(function(response){
			return response.data;
		});
	}

	return {
		addToPlaylist: addToPlaylist,
		makePlaylist: makePlaylist,
		getPlaylists: getPlaylists,
		getPopulatedPlaylist: getPopulatedPlaylist,
		deletePlaylist: deletePlaylist,
		removeFromPlaylist: removeFromPlaylist
	};
});
