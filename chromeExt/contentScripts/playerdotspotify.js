console.log('in content script');
var player;
function onPlayerChange() {
	console.log('in onPlayerChange');

	player = $("iframe#main").contents().find(".track.scroll");
	console.log('PLAYER METADATA: ', player);
    // var player = $("#app-player").contents().find("#track-name");
    // player.bind("DOMSubtreeModified", function () {
	setTimeout(function(){

		getSongInfo();
	},10000);
        // counter++;
        // if (counter == 2) {
        //     getSongInfo().then(function (songObj) {
        //         counter = 0;
        //         // console.log("Populated Song Obj:", songObj);
        //         if (songObj.source.spotifyUrl.indexOf('adclick') === -1) {
        //             var ytCallObj = {
        //                 artist: songObj.artist,
        //                 title: songObj.title,
        //                 message: "ytCall"
        //             };
        //             // console.log("sending songobj to router");
        //             chrome.runtime.sendMessage(ytCallObj, function (response1) {
        //                 // console.log("response w/ populated yt url:", response1);
        //                 songObj.source.url = response1;
        //                 songObj.source.sourceUrl = "https://youtube.com/watch?v=" + response1;
    	//                 chrome.runtime.sendMessage(songObj, function (response2) {
    	//                     console.log('response from router:', response2);
    	//                 });
        //             });
        //         }
        //     });
        // }
    // });
}

//timeout set in order to catch changes to artist name on DOM, which is fired after track name change
function getSongInfo() {
	console.log('in getSongInfo', player);
	// var test = player[0].
	var artist = player.contents().find("p.artist").innerText;
	var songTitle = player.contents().find("p.track").innerText;
	var href = player.contents().find(".track.scroll a").attr('href');
	var duration = $('#remaining').innerText;
	setTimeout(function(){

		console.log("YOOO: ",artist, songTitle, duration, href);

	},10000)

    // var appPlayer = $("#app-player").contents();
    // // var songTitle = appPlayer.find("#track-name").text();
    // // var duration = appPlayer.find("#track-length").text();
    // var href = appPlayer.find("#track-name > a").attr("href");
    // // console.log("appPlayer", appPlayer.find("#track-name > a").attr("href"));
    // return new Promise(function (resolve, reject) {
    //         setTimeout(function () {
    //             artist = appPlayer.find("#track-artist > a").text();
    //             var songObj = {
    //                 action: 'scrobble',
    //                 message: "Spotify",
    //                 category: 'Music',
    //                 duration: duration,
    //                 title: songTitle,
    //                 artist: artist,
    //                 source: {
    //                     domain: "Spotify",
    //                     videoTitle: null,
    //                     bandcampID: null,
    //                     spotifyUrl: href,
    //                     url: null,
    //                 }
    //             };
    //             return resolve(songObj);
    //         }, 500);
    // });
}

var counter = 0;

$('iframe#main').load(function () {
	console.log('in iframe load function');
    onPlayerChange();
});
