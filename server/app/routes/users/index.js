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

function checkLibrary(artist, title){

	return new Promise(function(resolve, reject){
		echo("song/search").get({artist: artist, title: title}, function (err, json) {
		if (err) console.log("EROR: ",err);
		var songToAdd;

		if (json.response.status.message === "Success" && json.response.songs.length > 0) {
			console.log("echonest matches", json.response.songs);
			var bestMatch = 0;
			json.response.songs.forEach(function(song){
				var tS = song.title.score(title);
				var aS = song.artist_name.score(artist);
				if (tS + aS > bestMatch) {
					bestMatch = tS + aS;
					console.log("title Score: " , tS);
					console.log("artist Score: " , aS);
					songToAdd = song;
				}
			});
			console.log("CLosest echonest match: ", songToAdd);
			console.log("Match percentage: ", bestMatch);

			if (songToAdd && bestMatch > 1){ //both title and artist are at least 75% likely to match
				return Song.findOne({echoNestId: songToAdd.id})
				.then(function(foundSong){
					console.log("FOUND SONG:",foundSong);
					if (!foundSong) return resolve({song: songToAdd, new: true});
					return resolve(foundSong);
				});
			} else {
				return resolve("not found");
			}
		} else {
			console.log('no echonest matches');
			return Song.find({})
			.then(function(allSongs){
				if (allSongs.length){
					console.log("all my songs: ",allSongs);
					// var source = req.body.message
					// var match;
					// allSongs.forEach(function(song){
					// 	if (req.body.url === song[source].url){
					// 		match = song;
					// 	}
					// })

					var newSong = _.max(allSongs, function(eachSong){
						var tS = eachSong.title.score(title);
						var aS = eachSong.artist.score(artist);
						if (aS === 0 || tS === 0) return;
						return (tS + aS);
					});
					if (newSong <= 0 || !newSong) {
						console.log('no matches in our db either');
						return resolve("not found");
					} else {
						return resolve(newSong);
					}
				} else {
					console.log('your db is empty');
					return resolve("not found");
				}
			});
		}
	}); });
}

function setSongBasedOnProvider (reqBody) {
	req.song = {
		title: reqBody.title,
		artist: reqBody.artist,
	}
	if (reqBody.message === "youtube") {f
		req.song.service ="YouTube";
		req.song.youtube = {
			videoTitle: reqBody.videoTitle,
			url: reqBody.url,
			duration: reqBody.duration,
		};
	}
	else if (reqBody.message === "bandcamp") {f
		req.song.service ="Bandcamp";
		req.song.bandcamp = {
			url: reqBody.url,
			duration: reqBody.duration,
			trackId: reqBody.trackId
		};
	}
	else if (reqBody.message === "soundcloud") {f
		req.song.service = "Soundcloud";
		req.song.bandcamp = {
			url: reqBody.url,
			duration: reqBody.duration,
			trackId: reqBody.trackId
		};
	}
}

//#1
router.put('/:userId/library', function (req, res, next) {
	console.log("hit put");
	checkLibrary(req.body.artist, req.body.title)
	.then(function(song){
		console.log('song on line 105:', song);
		console.log(song.new);
		if (song.new) { //should have an echonest id but not be in db
			req.newSong = true;
			req.song = {
				title : song.song.title,
				artist : song.song.artist_name,
				echoNestId : song.song.id,
				duration : req.body.duration,
				source: {
					domain: req.body.message,
					url : req.body.url,
					videoTitle : req.body.videoTitle,
					bandcampId : req.body.trackId
				}
			};
			console.log("line 102 req.song: ",req.song);
		} else if (song !== "not found" && !song.new){
			req.song = song;
			console.log("line 101 req.song: ",req.song);
			next();
		} else {
			req.song = {
				title: req.body.title,
				artist: req.body.artist,
				duration: req.body.duration,
				source: {
					domain: req.body.message,
					videoTitle: req.body.videoTitle,
					url: req.body.url,
					bandcampId: req.body.trackId
				}
			};
			//modify for different sources
		}
		console.log('got here, ', req.song);
		Song.create(req.song).then(function(newSong){
			console.log('just created', newSong);
			req.song = newSong;
			req.newSong = true;
			next();
		});
	});
});


//#2
router.put('/:userId/library', function (req, res, next) {
	if (req.newSong) {
		req.index = -1;
		next();
	} else {
		return User.populateMusicLibrary(req.foundUser)
			.then(function(populatedUser){
				req.index = populatedUser.findMatchIndex(req.song);
				next();
			})
			.then(null, function (err){
				console.log("ERROR", err);
				next(err);
			});
	}
});

//#3
router.put('/:userId/library', function (req, res, next) {
	req.foundUser.addToLibraryOrUpdate(req.song, req.index);
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
