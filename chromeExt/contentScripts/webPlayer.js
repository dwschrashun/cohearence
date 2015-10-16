var request = {message: 'playerAction'};
var theSlider;
var currentTime = $('#current-time');
var theDuration = $("#duration");
var currentSong = $('#current-song');
var welcome = $("#welcome-message");
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
		if (response.currentService){
			updateCurrentSong(response.currentSong);
			checkTimeRegularly(response.currentService);
		}
	});
});

//clicked should be a .song-list-item element
function loadSong (songToPlay) {
	var request = {};
	request.message = "cue";
	request.action = 'cue';
	request.service = songToPlay.currentSong.source.domain;
	request.id = songToPlay.currentSong.source.url;
	request.songIndex = songToPlay.currentIndex;


	theSlider.slider("option", "min", 0);
	currentTime.text("0:00");
	clearInterval(checkTime);
	checkTimeRegularly(request.service);

	return request;
}

function loadSongFromClicked (clicked) {
	var request = {};
	var source = clicked.find(".track-source");
	var updateMarquee = {
		artist: clicked.find('.track-artist').text(),
		title: clicked.find('.track-title').text()
	};

	request.message = "cue";
	request.action = 'cue';

	request.id = source.children("a").first().attr("href");
	request.songIndex = parseInt(clicked.parent().parent().attr("id").split("-")[2]);
	request.service = source.attr('data');

	theSlider.slider("option", "min", 0);
	currentTime.text("0:00");
	clearInterval(checkTime);
	checkTimeRegularly(request.service);

	updateCurrentSong(updateMarquee);

	chrome.runtime.sendMessage(request, function (response) {
		console.log('WEBPLAYER RESPONSE', response);
	});
}

function checkTimeRegularly(service) {
	var request = {
		message: "checkTimeAction",
		service: service
	};

	var max;

	chrome.runtime.sendMessage(request, function(response){
		max = response.duration;
		theSlider.slider({max: response.duration});
		theDuration.text(convertTime(response.duration));
		console.log('max originally set at ', max);
	});

	checkTime = setInterval(function(){
		chrome.runtime.sendMessage(request, function(response) {
			theSlider.slider({
				value: response.currentTime
			});
			currentTime.text(convertTime(response.currentTime));

			if (response.duration !== max) {
				console.log('better change that marquee');
				chrome.runtime.sendMessage({message: 'whoIsPlaying', action: true}, function(response){
					updateCurrentSong(response.currentSong);
					theSlider.slider("option", "min", 0);
					currentTime.text("0:00");
					clearInterval(checkTime);
					checkTimeRegularly(request.service);
				});
			}
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
        chrome.runtime.sendMessage(request, function (response) {
        });
	});
	$("#nav-play").on("click", function () {
		var request = {};
		request.message = "playerAction";
		current = $('.current');
		chrome.runtime.sendMessage({message: 'whoIsPlaying', action: true}, function (songToPlay) {
			if (songToPlay.currentService) {
				request = {message: 'playerAction'};
				request.action = 'play';
				request.service = songToPlay.currentService;
			} else {
				request = loadSong(songToPlay);
			}

			updateCurrentSong(songToPlay.currentSong);
			chrome.runtime.sendMessage(request, function (response) {
				console.log('WEBPLAYER RESPONSE', response);
			});
			// console.log('this is the request we are sending', request);
			// chrome.runtime.sendMessage(request, function (response) {

			// });
		});
		// var track;
		// if (!current.length){
		// 	track = $(".song-list-item").first();
		// 	console.log("loading new song from play button", track);
		// 	loadSong(track);
		// } else {
		// 	track = current.first().find(".track-source");
		// 	request.service = track.attr('data');
		// 	request.url = track.children('a').attr('href');
		// 	request.action = "play";
		// 	console.log('request in play else', request);
		// }
	});
	$("#nav-backward").on("click", function() {
		request.message = "changeSong";
		request.direction = "backward";
		chrome.runtime.sendMessage(request, function (response) {
			updateCurrentSong(response.nextSongObj);
		});
	});
	$("#nav-forward").on("click", function() {
		request.message = "changeSong";
		request.direction = "forward";
		chrome.runtime.sendMessage(request, function (response) {
			updateCurrentSong(response.nextSongObj);
		});
	});

	$(".song-list-item").on("click", function () {
		loadSongFromClicked($(this));
	});
}

function updateCurrentSong (newSongObj) {
	console.log('updating marquee', newSongObj);
	welcome.attr('hidden');
	currentSong.text(`${newSongObj.artist} - ${newSongObj.title}`)
	currentSong.removeAttr('hidden');
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
