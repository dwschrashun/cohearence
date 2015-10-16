var backgroundDoc;
var youtubePlayer;
var soundcloudVideo;
var bandcampVideo;
var serviceMethods = {};
var environment = {
	domain: null,
	server: null
};
var currentSongIndex = 0;
var currentService = null;

window.onload = function () {
	//set "environment" variables
	var manifest = chrome.runtime.getManifest();
	if (manifest.key) {
		environment.domain = "chrome-extension://jhddmhidckejknknbabaniikacgjhomb/";
		environment.server = "https://aqueous-gorge-7560.herokuapp.com/";
	}
	else {
		environment.domain = "http://localhost:1337";
		environment.server = "http://localhost:1337";
	}
	console.log("environment onload:", environment);

	//instantiate players in background html
	backgroundDoc = $(chrome.extension.getBackgroundPage().document);
	soundcloudVideo = backgroundDoc.find('#soundcloudPlayer');
	bandcampVideo = backgroundDoc.find('#bandcampPlayer');
	createYouTubeVideo();
	//get user from backend and update in local storage if exists
	getBackendUserAndUpdateLocalStorage();


};
