app.factory('UserFactory', function($http){

	var getAll = function (){
		return $http.get('/api/users')
		.then(response => response.data);
	};

	var getById = function (id) {
		return $http.get('/api/users/' + id)
		.then(response => response.data);
	};

	var deleteSong = function(userId, songId) {
		return $http.delete('/api/users/' + userId + '/library/' + songId)
		.then(response => response.data);
};

	return {
		getAll,
		getById,
		deleteSong,
	};
});
