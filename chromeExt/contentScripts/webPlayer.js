var request = {message: 'playerAction'};

//clicked should be a .song-list-item element
function loadSong (clicked) {
	var source = clicked.find(".track-source");
	request.action = 'cue';
	request.message = "cue";
	request.service = source.attr("data");
	request.id = source.children("a").first().attr("href");
	request.songIndex = parseInt(clicked.parent().parent().attr("id").split("-")[2]);
	console.log("Load request", request);
	console.log('dat clicked song', clicked);
	var theService = request.service;
	initiateSlider(theService);
	chrome.runtime.sendMessage(request, function (response) {
		console.log('WEBPLAYER RESPONSE', response)
	});
}

function initiateSlider(service) {
	var request = {
		message: "checkTimeAction",
		service: service
	}

  var theSlider = $('#slider');
  console.log(theSlider);
  theSlider.slider({
      min: 0,
  });
  var max = theSlider.slider("option", "max");

	chrome.runtime.sendMessage(request, function(response) {
		max = response.duration;
		if (theSlider.slider) {
			theSlider.slider("option", "max", 300);
			setInterval(function() {
				checkTimeRegularly(request.service);
			}, 1000);
		}
	})
}

function checkTimeRegularly(service) {
	var request = {
		message: "checkTimeAction",
		service: service
	}
	chrome.runtime.sendMessage(request, function(response) {
		var currentTime = response.currentTime;
		$('#slider').slider({
			value: currentTime
		})
	})
}

function pauseCheckTime() {
	clearInterval();
}

function setListeners () {

	setTimeout(function(){
		var current;

		$("#nav-pause").on("click", function() {
			request.message = "playerAction";
			request.action = "pause";
	        request.service = $(".current").first().find(".track-source").attr("data");
			// console.log("pause request:", request);
	        chrome.runtime.sendMessage(request, function (response) {
	            // console.log('response from router:', response);
	        });
		});
		$("#nav-play").on("click", function () {
			request.message = "playerAction";
			current = $('.current');
			//console.log("click on play:", current);
			var track;
			if (!current.length){
				track = $(".song-list-item").first();
				//console.log("loading new song from play button", track);
				loadSong(track);
			} else {
				track = current.first().find(".track-source");
				request.service = track.attr('data');
				request.url = track.children('a').attr('href');
				request.action = "play";
				//console.log('request in play else', request);
				chrome.runtime.sendMessage(request, function (response) {
					console.log('GOT THE RESPONSE', response);
				});
			}
		});
		$("#nav-backward").on("click", function() {
			// console.log("nave forward clicke");
			request.message = "changeSong";
			request.direction = "backward";
			chrome.runtime.sendMessage(request, function (response) {

			});
		});
		$("#nav-forward").on("click", function() {
			// console.log("nave forward clicke");
			request.message = "changeSong";
			request.direction = "forward";
			chrome.runtime.sendMessage(request, function (response) {

			});
		});

		$(".song-list-item").on("click", function () {
			// console.log("songlisitem click");
			loadSong($(this));
		});

	}, 2000);
}

$(document).ready(function () {
	setListeners();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'libLoaded') {
        // console.log("newSongLoaded in yt cs", request);
        setListeners();
    }
});
