var request = {message: 'playerAction'};


function loadSong (clicked) {
	var source = clicked.find(".track-source");
	request.message = "cue";
	request.service = source.attr("data");
	request.id = source.children("a").first().attr("href");
	request.songIndex = clicked.parent().parent().attr("id").split("-")[2];
	console.log("Load request", request);
	chrome.runtime.sendMessage(request, function (response) {

	});	
}

$(document).ready(function (){

	setTimeout(function(){
		var current;

		$("#nav-pause").on("click", function() {
			request.action = "pause";
	        request.service = $(".current").first().find(".track-source").attr("data");
			// console.log("pause service:", request.service);
	        chrome.runtime.sendMessage(request, function (response) {
	            // console.log('response from router:', response);
	        });
		});
		$("#nav-play").on("click", function () {
			current = $('.current');
			var track;
			if (!current){
				track = $('.track-title').first();
				loadSong(track);
			} else {
				track = current.first().find(".track-source");
				request.service = track.attr('data');
				request.url = track.children('a').attr('href');
				request.action = "play";
				chrome.runtime.sendMessage(request, function (response) {
					console.log('GOT THE RESPONSE', response);
				});
			}
		});
		$("#nav-backward").on("click", function() {
			chrome.runtime.sendMessage(request, function (response) {

			});
		});
		$("#nav-forward").on("click", function() {
			chrome.runtime.sendMessage(request, function (response) {

			});
		});

		$(".song-list-item").on("click", function () {
			loadSong($(this));
		});

	}, 1000);

});
