$(document).ready(function (){
	$("#nav-pause").on("click", function() {
		chrome.runtime.sendMessage(request, function (response) {

		});
	});
	$("#nav-play").on("click", function () {
		chrome.runtime.sendMessage(request, function (response) {

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