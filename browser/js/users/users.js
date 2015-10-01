app.config(function($stateProvider) {
	$stateProvider.state("users", {
		url: "/users",
    	templateUrl: '/js/users/users.html',
    	controller: function ($scope, findUsers) {
    		$scope.users = findUsers;
    	},
    	resolve: {
			findUsers: function(UserFactory){
				return UserFactory.getAll();
			}
		}
    });
});