app.directive('droppable', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element[0].addEventListener('drop', scope.handleDrop, false);
      element[0].addEventListener('dragover', scope.handleDragOver, false);
      element[0].addEventListener('dragleave', scope.handleDragLeave, false);
    },
    controller: 'DragAndDropCtrl'
  };
});
