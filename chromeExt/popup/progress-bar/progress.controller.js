app.controller('ProgressCtrl', function ($scope) {
    console.log('THE SCOPE', $scope);
    $scope.duration = 0;
    $scope.timeElapsed = 0;
    //send message to background script to get time elapsed
    function getTimeFromBackground() {
        if ($scope.currentService === 'YouTube') {
            var request = {
                message: "checkTimeAction",
                action: "checkTime",
                service: $scope.currentService
            };
            chrome.runtime.sendMessage(request, function (response) {
                // var theProgressBar = angular.element(elem.find('.progress-bar')[0]);
                // scope.theTime = response.currentTime/response.duration*100;
                $scope.duration = response.duration;
                $scope.timeElapsed = response.currentTime;
                $scope.$digest();
                // console.log('PROGRESS BAR', theProgressBar);
                // theProgressBar.css(
                // 	"width", response.currentTime/response.duration*100 + "%"
                // 	)
                // console.log('ze element', element)
            });
        }
    }
    setInterval(getTimeFromBackground, 1000);

    //if song is playing
    //constantly check:
    //whats the service?
    //set interval on this and poll time elapsed
    //poll page for time elapsed
    //calculate as percentage of total time
    //re render css accordingly
    // setInterval(function() {
    // 	console.log('elem', elem, 'attrs', attrs)
    // }, 2000)

});
