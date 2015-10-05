app.config(function($stateProvider) {
	$stateProvider.state("player", {
		url: '/player',
		templateUrl: '/popup/player/player.html',
		controller: 'playerCtrl',
		resolve: {
			theUser: function(LoginFactory) {
				return LoginFactory.isLoggedIn();
			}
		}
	})
})

app.controller('playerCtrl', function($scope, LoginFactory, theUser) {
console.log(theUser);
$scope.musicLibrary = theUser.musicLibrary;
})
