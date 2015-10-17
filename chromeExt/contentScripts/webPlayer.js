var request = {message: 'playerAction'};
var theSlider;
var currentTime = $('#current-time');
var theDuration = $("#duration");
var currentSong = $('#current-song');
var welcome = $("#welcome-message");
var checkTime;

$(document).ready(function () {
	setTimeout(setListeners, 700); //TODO: check this length on deployed version
	$('#nav-pause').addClass('hidden');
	theSlider = $('#slider');
	theSlider.slider({
        min: 0,
		max: 210,
		stop: function(event, ui) {
			sliderUpdater = undefined;
			var newTime = ui.value;
			seekTo(newTime);
		}
    });


	chrome.runtime.sendMessage({message: "whoIsPlaying", action: true}, function(response){
		console.log("RESPONSE ON LOAD: ", response);
		if (response.currentService){
			updateCurrentSong(response.currentSong);
			checkTimeRegularly(response.currentService);
			$('#nav-play').addClass('hidden');
			$("#nav-pause").removeClass('hidden');
		} else{
			$('#nav-pause').addClass('hidden');
			$("#nav-play").removeClass('hidden');
		}
	});
});

function seekTo(time) {
	chrome.runtime.sendMessage({message: "whoIsPlaying", action: true}, function(response){

		var request = {
			message: "changeTimeAction",
			action: "seekTo",
			service: response.currentService,
			time: time
		};

		chrome.runtime.sendMessage(request, function(response) {
		});
	});
}

function checkSoundcloudStreamable(id) {
	if (id.indexOf('soundcloud') === -1) {
		return false;
	}
	return true;
};


function confirmCorrectService(request){
	console.log("REQUEST: ", request)
	if (request.service === "Spotify") {
		request.service = "Youtube";
	}
	else if (request.service === "Soundcloud") {
		request.service = checkSoundcloudStreamable(request.id) ? "Soundcloud" : "YouTube";
	}
}

function loadSong (songToPlay) {
	var request = {};
	request.message = "cue";
	request.action = 'cue';

	request.service = songToPlay.currentSong.source.domain;

	request.id = songToPlay.currentSong.source.url;
	request.songIndex = songToPlay.currentIndex;

	confirmCorrectService(request);

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

	request.id = source.children("a").first().attr("data-url");
	request.songIndex = parseInt(clicked.parent().parent().attr("id").split("-")[2]);
	request.service = source.attr('data');

	confirmCorrectService(request);


	theSlider.slider("option", "min", 0);
	currentTime.text("0:00");
	clearInterval(checkTime);
	checkTimeRegularly(request.service);

	updateCurrentSong(updateMarquee);

	chrome.runtime.sendMessage(request, function (response) {
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
		console.log('getting new duration:', response.duration);
		theSlider.slider({max: response.duration});
		theDuration.text(convertTime(response.duration));
	});

	checkTime = setInterval(function(){
		chrome.runtime.sendMessage({message: 'whoIsPlaying', action: true}, function(response){
			checkIfPlaying(response.response);
			request.service = response.currentSong.source.domain;
			console.log("currently playing song: ",response.currentSong);

			console.log("that song's service, getting sent to checkTimeAction: ",response.currentSong.source.domain);
			chrome.runtime.sendMessage(request, function(timeResponse) {
				theSlider.slider({
					value: timeResponse.currentTime
				});
				currentTime.text(convertTime(timeResponse.currentTime));
				console.log("duration of currently playing song and max",timeResponse.duration, max);
				if (Math.round(timeResponse.duration*1000)/1000 !== Math.round(max*1000)/1000) {
					chrome.runtime.sendMessage({message: 'whoIsPlaying', action: true}, function(response){
						updateCurrentSong(response.currentSong);
						theSlider.slider("option", "min", 0);
						currentTime.text("0:00");
						clearInterval(checkTime);
						checkTimeRegularly(request.service);
					});
				}
			});
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

		$(this).addClass('hidden');
		$("#nav-play").removeClass('hidden');

		request.message = "playerAction";
		request.action = "pause";
        request.service = $(".current").first().find(".track-source").attr("data");

		chrome.runtime.sendMessage({message: "whoIsPlaying", action: true}, function(response){
			request.service = response.currentService;

	        chrome.runtime.sendMessage(request, function (response) {

	        });
		});

	});
	$("#nav-play").on("click", function () {

		$(this).addClass('hidden');
		$("#nav-pause").removeClass('hidden');

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
			});
		});
	});
	$("#nav-backward").on("click", function() {
		request.message = "changeSong";
		request.direction = "backward";
		chrome.runtime.sendMessage({action: "killPlayers"}, function(response){
			chrome.runtime.sendMessage(request, function (response) {
				updateCurrentSong(response.nextSongObj);
			});
		});
	});
	$("#nav-forward").on("click", function() {
		request.message = "changeSong";
		request.direction = "forward";
		chrome.runtime.sendMessage({action: "killPlayers"}, function(response){
			chrome.runtime.sendMessage(request, function (response) {
				updateCurrentSong(response.nextSongObj);
			});
		});
	});

	$(".song-list-item").on("click", function () {
		loadSongFromClicked($(this));
	});
}

function updateCurrentSong (newSongObj) {
	welcome.attr('hidden');
	currentSong.text(`${newSongObj.artist} - ${newSongObj.title}`)
	currentSong.removeAttr('hidden');
}

function convertTime(input) {
	input = Math.floor(parseInt(input));

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

function checkIfPlaying(response){
	var playing = false;
	for (var key in response){
		if (response[key]){
			playing = true;
		}
	}
	if (playing) {
		$('#nav-play').addClass('hidden');
		$("#nav-pause").removeClass('hidden');
	} else {
		$('#nav-pause').addClass('hidden');
		$("#nav-play").removeClass('hidden');
	}
}
