app.factory("LoginFactory", function ($http) {
    function login(credentials) {
        return $http.post('http://localhost:1337/login', credentials)
            .then(onSuccessfulLogin)
            .catch(function () {
                //return $q.reject({ message: 'Invalid login credentials.' });
            });
    }

    function onSuccessfulLogin(response) {
        var data = response.data;
        // Session.create(data.id, data.user);
        // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        return data.user;
    }

    function isLoggedIn() {
        chrome.storage.sync.get('user', function(frontendUser) {
            // return $http.get(`/api/user/${frontendUser.user._id}`)
            // .then(function(backendUser) {
            //     return !!backendUser;
            // })
            return !!frontendUser;
        })
    }

    return {
        login,
        onSuccessfulLogin,
        isLoggedIn
    };
});
