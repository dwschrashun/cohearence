var request = {message: 'playerAction'};

$(document).ready(function (){

	// setTimeout(function(){
	// 	var track = $('.track-source').first();
	// 	var service = track.attr('data');
	// 	var url = track.children('a').attr('href');
	//
	// 	request  = {
	// 		message: 'playerAction',
	// 		service: service,
	// 		url: url,
	// 	};
	// }, 1000);

	$("#nav-pause").on("click", function() {
		chrome.runtime.sendMessage(request, function (response) {

		});
	});
	$("#nav-play").on("click", function () {
		var current = $('.current');
		var track;
		if (!current){
			track = $('.track-source').first();
		} else {
			track = current.first().find(".track-source");
		}

		request.service = track.attr('data');
		request.url = track.children('a').attr('href');
		request.action = "play";
		console.log(request);
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

	// $("li")

});
