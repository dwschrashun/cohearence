app.controller('DragAndDropCtrl', function ($scope, PlaylistFactory) {

    var dragImage = document.createElement('img');
	dragImage.src = 'http://simpleicon.com/wp-content/uploads/music-note-5.svg';


    $scope.handleDragStart = function (e) {
		// console.log($scope.attributes);
        this.style.opacity = '.7';
        angular.element(e.dataTransfer.setData('text/html', this.attributes['id'].value));
        e.dataTransfer.setDragImage(this, 0, 0);
    };

    $scope.handleDragEnd = function (e) {
        this.style.opacity = '1.0';
    };

    $scope.handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var songId = e.dataTransfer.getData('text/html').split(">")[1];
		var playlistId = e.target.id;
        $scope.$apply(function () {
            PlaylistFactory.addToPlaylist(songId, playlistId);
        });
		this.style.backgroundColor = 'transparent';
        this.style.transform = 'scale(1.0)';
		// this.style.transition = 'all .5s ease-out-in';

    };

    $scope.handleDragOver = function (e) {
        e.preventDefault(); // Necessary. Allows us to drop.
        e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
		this.style.backgroundColor = 'rgb(194, 194, 194)';
    	this.style.transition = 'all .3s ease-in-out';
        this.style.transform = 'scale(1.1)';
        return false;
    };
    $scope.handleDragLeave = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
		this.style.backgroundColor = 'transparent';
		this.style.transition = 'all .3s ease-in-out';
		this.style.transform = 'scale(1.0)';
        // this.style.transition = '';
    };
});
