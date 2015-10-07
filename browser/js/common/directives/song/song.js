app.directive('song', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/song/song.html',
		controller: 'SongCtrl'
	};
});

app.controller('SongCtrl', function($scope) {
	console.log('im a song controller');
});
