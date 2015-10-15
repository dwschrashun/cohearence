app.directive('signupForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/signup-form/signup-form.html',
		controller: 'SignupCtrl'
	};
});
