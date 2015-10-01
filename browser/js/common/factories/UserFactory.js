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

	return {
		getAll: getAll,
		getById: getById
	}
});
