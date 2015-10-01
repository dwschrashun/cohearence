app.config(function($stateProvider) {
	$stateProvider.state("user", {
		url: "/users/:userId",
    	templateUrl: '/js/user/user.html',
    	controller: function ($scope, findUser) {
    		$scope.user = findUser;
    	},
    	resolve: {
      		findUser: function ($stateParams, UserFactory) {
      			console.log("userID", $stateParams.userId)
		        return UserFactory.getById($stateParams.userId)
		        .then(function(user){
		          return user;
		   		});
		   	}
		}
    });
});