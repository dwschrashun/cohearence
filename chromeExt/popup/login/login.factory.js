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
      var user = new Promise(function(resolve) {
        chrome.storage.sync.get('user', function(user) {
            if (user.user) return resolve(user.user);
            else resolve()
        })
      })
      return user;
    }

    function logout() {
      return new Promise(function(resolve) {
        chrome.storage.sync.remove('user', function() {
          resolve()
        });
      })
    }

    return {
      login,
      onSuccessfulLogin,
      isLoggedIn,
      logout
    };
});
