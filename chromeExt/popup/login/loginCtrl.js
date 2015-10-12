app.controller('LoginCtrl', function ($scope, LoginFactory, $state, theUser) {
    console.log('theUser in LoginCtrl', theUser);
    if (theUser) $state.go('player.musicLibrary');
    // $scope.login = {};
    // $scope.error = null;
    $scope.sendLogin = function (loginInfo) {
        $scope.error = null;
        LoginFactory.login(loginInfo)
        .then(function (user) {
            if (user) $state.go('player.musicLibrary');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});