function getSongInfo() {
	var songTitle = $('.track_info > .title-section > .title').text().trim() || $('.title_link .title').text().trim() || $('#name-section > .trackTitle').text().trim();
	//front page selection
	var frontPageArtistHref = $('.itemsubtext > .detail_item_link_2');
	var songHref = frontPageArtistHref.attr('href') || $('.title-section > .title_link').attr('href');
	var artist = frontPageArtistHref.text().trim() || $('[itemprop="byArtist"] > a').text().trim();
	var duration = $('.time.secondaryText > .time_total').text().trim();

	var trackId = $('#pagedata').data('blob').login_action_url;
	var itemId = trackId
	.match(/(item_id=)\d+/)[0]
	.split('=')[1];

	console.log('itemId', itemId);
	var songObj = {
		message: "bandcampSong",
		url: songHref,
		category: 'Music',
		duration: duration,
		title: songTitle,
		artist: artist,
		trackId: itemId
	};
	console.log('songObj', songObj);
	return songObj;
}

function onPlayerChange() {
	var songTitle = $('.title_link > .title');
	songTitle.bind("DOMSubtreeModified", function() {
		console.log('OMG CHANGING');
		getSongInfo();
	})
}

function sendSongToRouter(songObj) {
	chrome.runtime.sendMessage(songObj, function(response) {
		console.log(`response from router: ${response}`)
	})
}

$(document).ready(function() {
	console.log('=====!!!PAGE LOADED!!!=====')
	getSongInfo();
	onPlayerChange();
})
