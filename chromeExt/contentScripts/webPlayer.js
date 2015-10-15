var request = {message: 'playerAction'};
var theSlider;
var currentTime = $('#current-time');
var checkTime;

$(document).ready(function () {
	setTimeout(setListeners, 700); //TODO: check this length on deployed version
	theSlider = $('#slider');
	theSlider.slider({
        min: 0,
		max: 210
    });

	chrome.runtime.sendMessage({message: "whoIsPlaying", action: true}, function(response){
		console.log("RESPONSE FROM CHROME: ",response);
		var service = setCurrentService(response.response);
		if (service){
			checkTimeRegularly(service);
		}
	});
});

//clicked should be a .song-list-item element
function loadSong (clicked) {
	var source = clicked.find(".track-source");
	request.action = 'cue';
	request.message = "cue";
	request.service = source.attr("data");
	request.id = source.children("a").first().attr("href");
	request.songIndex = parseInt(clicked.parent().parent().attr("id").split("-")[2]);
	// console.log("Load request", request);
	// var theService = request.service;
	// console.log('dat clicked song', clicked);
	theSlider.slider("option", "min", 0);
	currentTime.text("0:00");
	clearInterval(checkTime);
	checkTimeRegularly(request.service);
	chrome.runtime.sendMessage(request, function (response) {
		console.log('WEBPLAYER RESPONSE', response)
	});
}


var setCurrentService = function (playerStates) {
	var playing = [];
	var playerStates = playerStates.response;
	for (var key in playerStates) {
		if (playerStates[key]) {
			playing.push(key);
		}
	}
	if (playing.length > 1) {
		chrome.runtime.sendMessage('killPlayers', function (response) {
			console.log(response);
			return null;
		});
	} else if (playing.length === 0) {
		return null;
	} else {
		return playing[0];
	}
};

function checkTimeRegularly(service) {
	var request = {
		message: "checkTimeAction",
		service: service
	};

	checkTime = setInterval(function(){
		console.log('checking time regularly');
		chrome.runtime.sendMessage(request, function(response) {
			theSlider.slider({
				value: response.currentTime
			});
			currentTime.text(convertTime(response.currentTime));
		});
	}, 1000);
}

function pauseCheckTime() {
	clearInterval();
}

function setListeners () {

	var current;

	$('#web-app-logout').on("click", function(){
		chrome.runtime.sendMessage({action: "killPlayers"});
	});

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
		request.message = "changeSong";
		request.direction = "forward";
		chrome.runtime.sendMessage(request, function (response) {

		});
	});

	$(".song-list-item").on("click", function () {
		// console.log("songlisitem click");
		loadSong($(this));
	});
}

function convertTime(input) {
	input = Math.floor(parseInt(input));
	// console.log(input);

	var hours = Math.floor(input / 60 / 60);
	hours = hours && hours < 10 ? "0" + Math.floor(hours) : Math.floor(hours);

	input = input - hours*60*60;
	var min = Math.floor(input / 60);

	var seconds = input;
	if (seconds > 60) {
	    seconds = Math.floor(seconds % 60);
	    seconds = seconds < 10 ? "0" + Math.floor(seconds) : Math.floor(seconds);
	} else {
	    seconds = seconds < 10 ? "0" + Math.floor(seconds) : Math.floor(seconds);
	}
	if (isNaN(min)) return '--:--';
	if (hours) return `${hours}:${min}:${seconds}`;
	return min + ":" + seconds;
}
