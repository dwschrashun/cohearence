app.factory("LoginFactory", function ($http, $rootScope) {
    function login(credentials) {
      return $http.post($rootScope.environment.server + '/login', credentials)
        .then(onSuccessfulLogin)
        .catch(function () {
          //return $q.reject({ message: 'Invalid login credentials.' });
        });
    }

    function onSuccessfulLogin(response) {
      var data = response.data;
      setInLocalStorage(data.user);
      return data.user;
    }

    function isLoggedIn() {
      var user = getFromLocalStorage();
      return getFromLocalStorage();
    }

    function logout() {
      return $http.get($rootScope.environment.server + '/logout')
      .then(removeFromLocalStorage);
    }

    function setInLocalStorage(user) {
      var stringifiedUser = JSON.stringify(user);
      localStorage.setItem("cohearenceUser", stringifiedUser);
    }

    function getFromLocalStorage() {
      var stringifiedUser = localStorage.getItem("cohearenceUser");
      return JSON.parse(stringifiedUser);
    }

    function removeFromLocalStorage() {
      localStorage.removeItem("cohearenceUser");
    }

    return {
      login,
      onSuccessfulLogin,
      isLoggedIn,
      logout
    };
});
