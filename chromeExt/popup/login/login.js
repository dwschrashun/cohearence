'use strict';

// app.config(function ($urlRouterProvider, $locationProvider) {
//     // This turns off hashbang urls (/#about) and changes it to something normal (/about)
//     // $locationProvider.html5Mode(true);
//     // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
//     $urlRouterProvider.otherwise('/');
// });

app.config(function ($stateProvider) {
    $stateProvider.state("login", {
        url: "/",
        templateUrl: "popup/login/login.html",
        controller: 'LoginCtrl',
        resolve: {
            theUser: function(LoginFactory) {
                return LoginFactory.isLoggedIn();
            },
        }
    });
});

app.controller('LoginCtrl', function ($scope, LoginFactory, $state, theUser) {

    $scope.getLoggedInUser = function() {
        if (theUser) $state.go('player');
        //if user isn't logged in, retrieve environment vars
    };
    $scope.getLoggedInUser();
    // $scope.oauthLogin = function(){
    //   chrome.identity.getAuthToken( function(token) {
    //       console.log('did identity');
    //   });
    // };
    $scope.login = {};
    $scope.error = null;
    $scope.sendLogin = function (loginInfo) {
        $scope.loginError = null;
        LoginFactory.login(loginInfo)
        .then(function (user) {
            console.log("User?", user);
            if (user.status) {
                $scope.loginError = "Invalid login credentials";
                console.log("ERR", $scope.loginError);
            }
            else if (user.musicLibrary) $state.go('player');
        // }).catch(function () {
        //     $scope.error = 'Invalid login credentials.';
        });
    };


    $scope.goToWebApp = function () {
        let request = {
            message: 'environmentAction'
        };

        chrome.runtime.sendMessage(request, response => {
            console.log('RESPONSE', response);
            chrome.tabs.create({url: response.environment.server});
        });
    };
});




// // This app.run is for controlling access to specific states.
// app.run(function ($rootScope, AuthService, $state) {

//     // The given state requires an authenticated user.
//     var destinationStateRequiresAuth = function (state) {
//         return state.data && state.data.authenticate;
//     };

//     // $stateChangeStart is an event fired
//     // whenever the process of changing a state begins.
//     $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

//         if (!destinationStateRequiresAuth(toState)) {
//             // The destination state does not require authentication
//             // Short circuit with return.
//             return;
//         }

//         if (AuthService.isAuthenticated()) {
//             // The user is authenticated.
//             // Short circuit with return.
//             return;
//         }

//         // Cancel navigating to new state.
//         event.preventDefault();

//         AuthService.getLoggedInUser().then(function (user) {
//             // If a user is retrieved, then renavigate to the destination
//             // (the second time, AuthService.isAuthenticated() will work)
//             // otherwise, if no user is logged in, go to "login" state.
//             if (user) {
//                 $state.go(toState.name, toParams);
//             } else {
//                 $state.go('login');
//             }
//         });

//     });

// });
