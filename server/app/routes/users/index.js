var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
require("string_score");
var echojs = require('echojs');
var echo = echojs({
  key: "BC5YTSWIE5Q9YWVGF"
});
var deepPopulate = require("mongoose-deep-populate")(mongoose);
var http = require("http");


router.get("/", function (req, res) {
	User.find()
	.then(function (users) {
		users = users.map(function (user) {
			return _.omit(user.toJSON(), ['salt', 'password']);
		});
		res.json(users);
	});
});

router.get('/:userId', function (req, res) {
	res.json(_.omit(req.foundUser.toJSON(), ['salt', 'password']));
});

router.get('/:userId/library', function (req, res, next) {
	User.deepPopulate(req.foundUser, 'musicLibrary.song', function (err, populated) {
		if (err) next(err);
		else {
			res.json(populated);
		}
	});
});

function fuzzySearch(arr, artist, title){
	var artistMax = 0;
	var titleMax = 0;
	var max = arr[0];
	arr.forEach(function(el) {
		el.titleScore = title.score(el.title);
		el.artistScore = artist.score(el.artist_name);
		console.log("hello ",el, el.titleScore, el.artistScore);
		if ((el.titleScore + el.artistScore) > (titleMax + artistMax ) && el.titleScore > .75 && el.artistScore > .75) {
			titleMax = el.titleScore;
			artistMax = el.artistScore;
			max = el;
		}
	});
	return max;
}
function checkEchoNest(artist, title){
	return new Promise(function(resolve, reject){
		echo("song/search").get({artist: artist, title: title}, function(err, json){
			if (err) console.log("ERROR: ",err);
			else if (json.response.status.message === "Success" && json.response.songs.length > 0){
				// console.log('Matches from echonest: ' , json.response.songs);
				var bestMatch = fuzzySearch(json.response.songs, artist, title);
				console.log('best match: ', bestMatch);
				return resolve(bestMatch);
			} else {
				console.log('no matches');
				return resolve(null);
			}
		});
	});
}

function getSpotifyFakeUrl (title, artist) {
	//get youtube URL from youtube API using http
	// http.get("https://www.googleapis.com/youtube/v3/search");

	// videoCategoryid?
}

function createSongFromReqBody(reqBody){
	var title = reqBody.title || "unknown";
	var artist = reqBody.artist || "unknown";
	var source = reqBody.source || {
		domain: null,
		url: null,
		videoTitle: null,
		bandcampId: null,
		spotifyUrl: null
	};

	if (source.domain === "Spotify") {
		getSpotifyFakeUrl(reqBody.title, reqBody.artist).then(function (url){
			source.fakeUrl = url;
			var newSongObj = {
				title: title,
				artist: artist,
				source: source
			};
			return newSongObj;
		});
	}
	else {
		var newSongObj = {
			title: title,
			artist: artist,
			source: source
		};
		return newSongObj;
	}
}
//#1 Search in EchoNest
router.put('/:userId/library', function(req, res, next){
	//console.log('hit route 1', req.body);
	checkEchoNest(req.body.artist, req.body.title)
	.then(function(match){
		if (match){
			console.log("EN MATCH:", match);
			req.echoNestId = match.id;
			req.title = match.title;
			req.artist = match.artist_name;
		}
		// console.log("song: ",match);
		next();
	});
});

//#2 Search in our library
router.put('/:userId/Library', function(req, res, next){
	if (req.echoNestId){
		// console.log('YES');
		Song.findOne({echoNestId: req.echoNestId})
		.then(function(foundSong){
			if (foundSong) {
				// console.log("Found the song in our library, with echonest:",foundSong);
				req.songToSave = foundSong;
				next();
			} else {
				// console.log('need to create it ourselves 1');
				req.songToSave = createSongFromReqBody(req.body);
				req.songToSave.echoNestId = req.echoNestId;
				req.new = true;
				// console.log("Your newly created song object: ", req.songToSave);
				next();
			}
		});
	} else {
		var url = req.body.source.url;
		// console.log('NO');
		Song.findOne({'source.url': url})
		.then(function(foundSong){
			if (foundSong) {
				// console.log("Found the song in our library, with url:",foundSong);
				req.songToSave = foundSong;
				next();
			} else {
				// console.log('need to create it ourselves 2');
				req.songToSave = createSongFromReqBody(req.body);
				req.new = true;
				// console.log("Your newly created song object: ", req.songToSave);
				next();
			}
		});
	}
});

//#3 Create the song if we have to and check if its on the user
router.put('/:userId/Library', function(req, res, next){
	if (req.new) {
		console.log("NEW SONG", req.songToSave);
		Song.create(req.songToSave)		//must create song
		.then(function(newSong){
			console.log("created the new song in main library");
			req.songToSave = newSong; //reassign songToSave
			req.index = -1;
			next();
		}).then(null, function (err){
			console.log("ERROR:", err);
		});
	} else { //not new so must check if user has it
		User.populateMusicLibrary(req.foundUser)
		.then(function(populatedUser){
			req.index = populatedUser.findMatchIndex(req.songToSave);
			next();
		});
	}
});

//#4 finally, add it to the user
router.put('/:userId/library', function (req, res, next) {
	req.foundUser.addToLibraryOrUpdate(req.songToSave, req.index);
	return req.foundUser.save()
	.then(function(savedUser){
		savedUser.deepPopulate('musicLibrary.song', function(err, user){
			if (err) {
				console.log("DP ERROR", err);
				// return reject(err);
				return;
			}
			console.log("NEW UPDATED FRESH LIBRARY: ",user.musicLibrary);
			res.status(201).json(user.musicLibrary);
		});
	}).then(null, next);
});

function oldPutRoute(){

// function checkLibrary(artist, title){
//
// 	return new Promise(function(resolve, reject){
// 		echo("song/search").get({artist: artist, title: title}, function (err, json) {
// 		if (err) console.log("EROR: ",err);
// 		var songToAdd;
//
// 		if (json.response.status.message === "Success" && json.response.songs.length > 0) {
// 			console.log("echonest matches", json.response.songs);
// 			var bestMatch = 0;
// 			json.response.songs.forEach(function(song){
// 				if (!title || !artist) return 0;
// 				var tS = song.title.score(title);
// 				var aS = song.artist_name.score(artist);
// 				if (tS + aS > bestMatch) {
// 					bestMatch = tS + aS;
// 					console.log("title Score: " , tS);
// 					console.log("artist Score: " , aS);
// 					songToAdd = song;
// 				}
// 			});
// 			console.log("CLosest echonest match: ", songToAdd);
// 			console.log("Match percentage: ", bestMatch);
//
// 			if (songToAdd && bestMatch > 1){ //both title and artist are at least 75% likely to match
// 				return Song.findOne({echoNestId: songToAdd.id})
// 				.then(function(foundSong){
// 					console.log("FOUND SONG:",foundSong);
// 					if (!foundSong) return resolve({song: songToAdd, new: true});
// 					return resolve(foundSong);
// 				});
// 			} else {
// 				return resolve("not found");
// 			}
// 		} else {
// 			console.log('no echonest matches');
// 			return Song.find({})
// 			.then(function(allSongs){
// 				if (allSongs.length){
// 					console.log("all my songs: ",allSongs);
// 					// var source = req.body.message
// 					// var match;
// 					// allSongs.forEach(function(song){
// 					// 	if (req.body.url === song[source].url){
// 					// 		match = song;
// 					// 	}
// 					// })
//
// 					var newSong = _.max(allSongs, function(eachSong){
// 						if (!title || !artist) return 0;
// 						var tS = eachSong.title.score(title);
// 						var aS = eachSong.artist.score(artist);
// 						if (aS === 0 || tS === 0) return;
// 						return (tS + aS);
// 					});
// 					if (newSong <= 0 || !newSong) {
// 						console.log('no matches in our db either');
// 						return resolve("not found");
// 					} else {
// 						return resolve(newSong);
// 					}
// 				} else {
// 					console.log('your db is empty');
// 					return resolve("not found");
// 				}
// 			});
// 		}
// 	}); });
// }
//
// //#1
// router.put('/:userId/library', function (req, res, next) {
// 	console.log("hit put");
// 	checkLibrary(req.body.artist, req.body.title)
// 	.then(function(song){
// 		console.log('song on line 105:', song);
// 		console.log(song.new);
// 		if (song.new) { //should have an echonest id but not be in db
// 			req.newSong = true;
// 			req.song = {
// 				title : song.song.title,
// 				artist : song.song.artist_name,
// 				echoNestId : song.song.id,
// 				duration : req.body.duration,
// 				source: {
// 					domain: req.body.message,
// 					url : req.body.url,
// 					videoTitle : req.body.videoTitle,
// 					bandcampId : req.body.trackId
// 				}
// 			};
// 			console.log("line 102 req.song: ",req.song);
// 		} else if (song !== "not found" && !song.new){
// 			req.song = song;
// 			console.log("line 101 req.song: ",req.song);
// 			next();
// 		} else {
// 			req.song = {
// 				title: req.body.title,
// 				artist: req.body.artist,
// 				duration: req.body.duration,
// 				source: {
// 					domain: req.body.message,
// 					videoTitle: req.body.videoTitle,
// 					url: req.body.url,
// 					bandcampId: req.body.trackId
// 				}
// 			};
// 			//modify for different sources
// 		}
// 		console.log('got here, ', req.song);
// 		Song.create(req.song).then(function(newSong){
// 			console.log('just created', newSong);
// 			req.song = newSong;
// 			req.newSong = true;
// 			next();
// 		});
// 	});
// });
//
//
// //#2
// router.put('/:userId/library', function (req, res, next) {
// 	if (req.newSong) {
// 		req.index = -1;
// 		next();
// 	} else {
// 		return User.populateMusicLibrary(req.foundUser)
// 			.then(function(populatedUser){
// 				req.index = populatedUser.findMatchIndex(req.song);
// 				next();
// 			})
// 			.then(null, function (err){
// 				console.log("ERROR", err);
// 				next(err);
// 			});
// 	}
// });

//#3
// router.put('/:userId/library', function (req, res, next) {
// 	req.foundUser.addToLibraryOrUpdate(req.song, req.index);
// 	return req.foundUser.save()
// 	.then(function(savedUser){
// 		savedUser.deepPopulate('musicLibrary.song', function(err, user){
// 			if (err) {
// 				console.log("DP ERROR", err);
// 				// return reject(err);
// 				return;
// 			}
// 			console.log("NEW UPDATED FRESH LIBRARY: ",user.musicLibrary);
// 			res.status(201).json(user.musicLibrary);
// 		});
// 	}).then(null, next);
// });
}


router.param('userId', function (req, res, next, userId) {
	User.findById(userId).deepPopulate("musicLibrary.song").exec(function (err, populated) {
		if (err) {
			console.log("ERROR", err);
			next(err);
		}
		else {
			// console.log("hit param", populated);
			req.foundUser = populated;
			next();
		}
	});
});
