app.controller('ProgressCtrl', function ($scope, PlayerFactory, $interval) {
    // if (!$scope.duration || !$scope.timeElapsed) [$scope.duration, $scope.timeElapsed] = [0, 0];
    // if (!$scope.paused) {
    //     $scope.duration = 0;
    //     $scope.timeElapsed = 0;
    // }
    $scope.duration = 0;
    $scope.timeElapsed = 0;
    //initialize slider
    var theSlider = $('#slider');
    theSlider.slider({
        min: 0,
        stop: function(event, ui) {
            $interval.cancel(sliderUpdater);
            sliderUpdater = undefined;
            $scope.pauseVideo();
            var newTime = ui.value;
            $scope.seekTo(newTime);
            $scope.playVideo();
            sliderUpdater = $interval(getTimeFromBackground, 1000);
            // console.log(newTime);
        }
    });
    var max = theSlider.slider("option", "max");

    //send message to background script to get time elapsed
    function getTimeFromBackground() {
        chrome.runtime.sendMessage({message: 'whoIsPlaying', action: true}, function (response) {
            var currentService = PlayerFactory.setCurrentService(response);
            var request = {
                message: "checkTimeAction",
                service: currentService
            };
            chrome.runtime.sendMessage(request, function (response) {
                $scope.duration = response.duration || $scope.duration ;
                $scope.timeElapsed = response.currentTime || $scope.timeElapsed;
                if ($scope.duration !== max) {
                    max = $scope.duration;
                    theSlider.slider("option", "max", max);
                }
                theSlider.slider({
                    value: $scope.timeElapsed
                });
                $scope.$digest();
            });
        });
    }
    var sliderUpdater = $interval(getTimeFromBackground, 100);
});

app.filter('songTime', function() {
    return function(input) {
        input = Math.floor(parseInt(input));
        // console.log(input);

        var hours = Math.floor(input / 60 / 60);
        hours = hours && hours < 10 ? "0" + Math.floor(hours) : Math.floor(hours);

        input = input - hours*60*60;
        var min = Math.floor(input / 60);
        min = min < 10 ? "0" + min : min;

        var seconds = input;
        if (seconds > 60) {
            seconds = Math.floor(seconds % 60);
            seconds = seconds < 10 ? "0" + Math.floor(seconds) : Math.floor(seconds);
        } else {
            seconds = seconds < 10 ? "0" + Math.floor(seconds) : Math.floor(seconds);
        }
        if (hours) return `${hours}:${min}:${seconds}`;
        return min + ":" + seconds;
    };
});
