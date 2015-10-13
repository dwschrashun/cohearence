var request;

$(document).ready(function (){

	setTimeout(function(){
		var track = $('.track-source').first();
		var service = track.attr('data');
		var url = track.children('a').attr('href');

		request  = {
			message: 'playerAction',
			service: service,
			url: url,
		};
	}, 1000);

	$("#nav-pause").on("click", function() {
		chrome.runtime.sendMessage(request, function (response) {

		});
	});
	$("#nav-play").on("click", function () {
		console.log(request);
		request.action = "play";
		chrome.runtime.sendMessage(request, function (response) {
			console.log('GOT THE RESPONSE', response);
		});
	});
	$("#nav-backward").on("click", function() {
		chrome.runtime.sendMessage(request, function (response) {

		});
	});
	$("#nav-forward").on("click", function() {
		chrome.runtime.sendMessage(request, function (response) {

		});
	});
});
