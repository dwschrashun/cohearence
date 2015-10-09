app.directive('songList', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/song-list/song-list.html',
		controller: 'songListCtrl'
	};
});

app.controller('songListCtrl', function($scope) {

});
