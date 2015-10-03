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
	User.populate(req.foundUser, 'musicLibrary.song')
		.then(function (populatedUser) {
			res.json(populatedUser);
		})
		.then(null, next);
});

router.put('/:userId/library', function (req, res, next) {
	// Make API call to echoNest to get songId
	return res.json(req.body);
	echo("song/search").get({artist: req.body.artist, title: req.body.title}, function (err, json) {
		// if (err) res.json(err);
		// var songToAdd;

		// //if echonest found matches, find the highest string match from the response
		// if (json.response.status.message === "Success") {
		// 	songToAdd = _.max(json.response.songs, function(song){
		// 		return song.title.score(req.body.title);
		// 	});
		// }
		//for testing
		console.log('got to the server route');
		return res.json(req.body);

		//if echonest didn't find a match, save the original request as the song
		if (songToAdd < 0 || !songToAdd) {
			songToAdd = req.body;
		}
		//if we did find it, format it like this:
		else {
			songToAdd = {
				title: songToAdd.title,
				artist: songToAdd.artist_name,
				youtube: {
					url: req.body.url,
					title: req.body.videoTitle,
					duration: req.body.duration,
				},
				echoNestId: songToAdd.id
			};
		}
	// Check if song exists in Song model
		if (songToAdd.echoNestId){
			Song.checkSongAgainstCollection(songtoAdd, req, next)
			//hits .then only if new song was created, otherwise it returned next()
			.then(function(newSong){ //it's a song
				if (!newSong) return next();
				console.log('NEWSONG : ', newSong);
				req.foundUser.addToLibrary(newSong);
				return req.foundUser.save();
			})
			.then(function(savedUser){
				if (!savedUser) return next();
				console.log("UPDATED USER LIBRARY: ", savedUser);
				res.json(savedUser.musicLibrary);
			})
			.then(null, next); //end of Song.findOne
		} else {
			next();
		}
	}); //end of echo callback
});

router.put('/:userId/library', function(req,res,next){
	User.populateMusicLibrary(req.foundUser)
	.then(function(populatedUser){
		console.log("Music Library: ", populatedUser.musicLibrary);
		checkMatchAndAdd(populatedUser, req.foundSong);
		return populatedUser.save();
	}).then(function(savedUser){
		console.log("Saved User: ", savedUser.musicLibrary);
		res.json(savedUser.musicLibrary);
	});
});


router.param('userId', function (req, res, next, userId) {
	User.findById(userId)
	.then(function (user) {
		req.foundUser = user;
		next();
	})
	.then(null, next);
});

//functions
function checkMatchAndAdd(popUser, songToAdd){
	var index = popUser.findMatchIndex(songToAdd);
	return popUser.addToLibrary(songToAdd, index);
}
