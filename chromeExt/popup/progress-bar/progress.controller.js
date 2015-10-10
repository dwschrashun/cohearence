app.controller('ProgressCtrl', function ($scope, PlayerFactory) {
    console.log('THE SCOPE', $scope);
    $scope.duration = 0;
    $scope.timeElapsed = 0;
    //send message to background script to get time elapsed
    function getTimeFromBackground() {
        chrome.runtime.sendMessage('whoIsPlaying', function (response) {
            var currentService = PlayerFactory.setCurrentService(response);
            var request = {
                message: "checkTimeAction",
                service: currentService
            };
            console.log('making request for time with', request);
            chrome.runtime.sendMessage(request, function (response) {
                $scope.duration = response.duration;
                $scope.timeElapsed = response.currentTime;
                $scope.$digest();
            });
        });
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
