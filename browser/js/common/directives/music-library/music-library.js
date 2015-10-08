app.directive('musicLibrary', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/music-library/music-library.html',
		controller: 'MusicLibraryCtrl'
	};
});

app.controller('MusicLibraryCtrl', function($scope) {

});
