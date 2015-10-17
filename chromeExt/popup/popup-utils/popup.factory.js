'use strict';

app.factory('PopupFactory', function() {

	function getEnvironmentVariables() {
		request = {
			message: 'environmentAction'
		};

		chrome.runtime.sendMessage(request, response => {
			console.log('RESPONSE', response);
			chrome.tabs.create({url: response.environment.domain});
		});
	}

	return {
		getEnvironmentVariables
	}
})
