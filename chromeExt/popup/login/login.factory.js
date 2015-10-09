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
      console.log('onsuccessful', data.user);
      setInLocalStorage(data.user);
      return data.user;
    }

    function isLoggedIn() {
      var user = getFromLocalStorage();
      console.log('user', user);
      return getFromLocalStorage();
    }

    function logout() {
      return $http.get('http://localhost:1337/logout')
      .then(removeFromLocalStorage)
    }

    function setInLocalStorage(user) {
      var stringifiedUser = JSON.stringify(user);
      console.log('STRINGIFIED POPUP USER ABOUT TO BE SET ON LOGIN', stringifiedUser);
      localStorage.setItem("cohearenceUser", stringifiedUser);
    }

    function getFromLocalStorage() {
      var stringifiedUser = localStorage.getItem("cohearenceUser");
      console.log('GETTING FROM LOCAL STORAGE IN POPUP', JSON.parse(stringifiedUser));
      return JSON.parse(stringifiedUser)
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
