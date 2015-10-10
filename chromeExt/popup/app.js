//instantiate angular app

window.app = angular.module('ScrobblerPopUp', ['ui.router', 'ngMaterial']);


app.config(function($urlRouterProvider, $locationProvider) {
	 $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

app.run(function($rootScope) {
    // if (LoginFactory.isLoggedIn()) {
    //     $state.go('player');
    // } else {
    //     $state.go('login');
    // }
    console.log("app.run");
    chrome.runtime.sendMessage({message: "getEnv"}, function (environment) {
        $rootScope.environment = environment;
        console.log("environment set:", $rootScope.environment);
    });
});
