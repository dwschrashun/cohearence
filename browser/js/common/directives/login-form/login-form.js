app.directive('loginForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/login-form/login-form.html',
		controller: 'LoginCtrl'
	};
});
