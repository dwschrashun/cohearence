//instantiate angular app

window.app = angular.module('ScrobblerPopUp', ['ui.router', 'ngMaterial']);


app.config(function($urlRouterProvider, $locationProvider) {
	 $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
})

app.run(function(LoginFactory, $state) {
    // if (LoginFactory.isLoggedIn()) {
    //     $state.go('player');
    // } else {
    //     $state.go('login');
    // }


})
