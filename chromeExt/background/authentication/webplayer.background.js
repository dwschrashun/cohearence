var webAppUrls = [
	"http://localhost:1337",
	"http://cohearence.io",
	"https://aqueous-gorge-7560.herokuapp.com/"
];

//inject event handlers on web app control buttons
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	console.log("TAB", tab);
	// if (tab.url.indexOf('http://localh') !== -1 && changeInfo && changeInfo.status == "complete") {

	// }
});
