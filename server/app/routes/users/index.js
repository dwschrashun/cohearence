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
	echo("song/search").get({artist: req.body.artist, title: req.body.title}, function (err, json) {
		if (err) res.json(err);
		var songToAdd;

		//if echonest found matches, find the highest string match from the response
		if (json.response.status.message === "Success") {
			songToAdd = _.max(json.response.songs, function(song){
				return song.title.score(req.body.title);
			});
		}

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
			Song.findOne({echoNestId: songToAdd.echoNestId})
			.then(function(foundSong){
				if (foundSong) { // If exists get _id
					console.log('found the song in our library', foundSong);
					req.foundSong = songToAdd;
					return next();
				}
				else { // if we don't have the song in our library, create it and add it to the user
					console.log('didnt find the song in our library, gonna create it and add it to user');
					return Song.create(songToAdd);
				}
			})
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
	User.populate(req.foundUser, 'musicLibrary.song')
	.then(function(populatedUser){
		console.log("Music Library: ", populatedUser.musicLibrary);
		checkMatch(populatedUser, songToAdd);
	})
	.then(function(){
		return req.foundUser.save();
	}).then(function(savedUser){
		console.log("Saved User: ", savedUser.musicLibrary);
		res.json(savedUser.musicLibrary);
	});
});

function checkMatch(popUser, songToAdd){
	console.log(" in check match");
	var index = _.findIndex(popUser.musicLibrary, function(el) {
		console.log("EL",el);
		if (songToAdd.echoNestId){
			return el.song.echoNestId === songToAdd.echoNestId;
		} else {
			return el.song.title.score(songToAdd.title) > .75;
		}
	});
	if (index !== -1) {
		console.log('user has the song, will increase play count');
		req.foundUser.musicLibrary[index].plays.push(new Date());
	} else { // else push song into user library
		console.log('user does not have the song, will add it for them');
		req.foundUser.addToLibrary(songToAdd);
	}
}

router.param('userId', function (req, res, next, userId) {
	User.findById(userId)
	.then(function (user) {
		req.foundUser = user;
		next();
	})
	.then(null, next);
});
