app.factory('UserFactory', function($http){

	var getAll = function (){
		return $http.get('/api/users')
		.then(function(response){
			return response.data;
		});
	};

	var getById = function (id) {
		return $http.get('/api/users/' + id)
		.then(function(response){
			return response.data;
		});
	};

	var deleteSong = function(userId, songId) {
		return $http.delete('/api/users/' + userId + '/library/' + songId)
		.then(function(response){
			return response.data;
	});
};

	return {
		getAll: getAll,
		getById: getById,
		deleteSong: deleteSong
	};
});
