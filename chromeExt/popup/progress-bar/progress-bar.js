app.directive('progressBar', function() {
	return {
		restrict: 'E',
		templateUrl: 'popup/progress-bar/progress-bar.html',
		link: function(scope, elem, attrs) {

			console.log('THE SCOPE', scope);
			//send message to background script to get time elapsed
			function getTimeFromBackground() {
				if (scope.currentService === 'YouTube') {
					console.log(scope.currentService)
					var request = {
						message: "checkTimeAction",
						action: "checkTime",
						service: scope.currentService
					}
					console.log('link fn service', request.service)
					chrome.runtime.sendMessage(request, function(response) {
						console.log('response', response);
						var theProgressBar = angular.element(elem[0])
						theProgressBar.css({
							"width": response.currentTime/response.duration*100 + "%"
						})
						// console.log('ze element', element)
					})
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
		}
	}
})
