function getSongInfo(trackSrc) {
	var songTitle = $('.track_info > .title-section > .title').text().trim() || $('.title_link .title').text().trim() || $('#name-section > .trackTitle').text().trim();
	//front page selection
	var frontPageArtistHref = $('.itemsubtext > .detail_item_link_2');
	var songHref = frontPageArtistHref.attr('href') || $('.title-section > .title_link').attr('href');
	var artist = frontPageArtistHref.text().trim() || $('[itemprop="byArtist"] > a').text().trim();
	var duration = $('.time.secondaryText > .time_total').text().trim();

	var songObj = {
		action: 'scrobble',
		message: "Bandcamp",
		url: songHref,
		category: 'Music',
		duration: duration,
		title: songTitle,
		artist: artist,
		trackId: trackSrc
	};
	sendSongToRouter(songObj);
}

function sendSongToRouter(songObj) {
	chrome.runtime.sendMessage(songObj, function(response) {
		console.log(`response from router: ${response}`)
	})
}

function watchAudioTag() {
	var audioTag = $('audio');
	audioTag.watch({
		properties: 'attr_src',
		callback: function(data, i) {
			var newValue = data.vals[i];
			getSongInfo(newValue);
		}
	});
}

$(document).ready(function() {
	console.log('=====!!!PAGE LOADED!!!=====');
	watchAudioTag();
});
