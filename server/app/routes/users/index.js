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

router.get("/", function (req, res, next) {
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
		var songToAdd;
		if (err) res.json(err);

		if (json.response.status.message === "Success") {

			songToAdd = _.max(json.response.songs, function(song){
				return song.title.score(req.body.title);
			});
		}
		if (songToAdd < 0 || !songToAdd) {
			//if we couldn't find it in echonest, just store the url
			//and send them back their original request.
			songToAdd = req.body;
		} else {
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
		req.foundUser.addToLibrary(songToAdd);
		res.json(songToAdd);
	});
	// Check if song exists in Song model
		// If exists get _id
			// check if song is in user library - increment plays with a new Date()
			// else push song in user library with new date
		// Else create song
			// insert song into user library
	// User.populate(req.foundUser, 'musicLibrary.song')
	// 	.then(function (populatedUser) {
	// 		var index = _.findIndex(req.foundUser.musicLibrary, function(el) {
	// 			return el.song.youtube.url === req.body.href;
	// 		});
	// 		if (index !== -1) {
	// 			req.foundUser.musicLibrary[index].plays.push(new Date());
	// 		} else {
	// 			// req.foundUser.musicLibrary.push({})
	// 		}
	// 	})
	// 	.then(null, next);
	// req.foundUser.musicLibrary.push();
});

router.param('userId', function (req, res, next, userId) {
	User.findById(userId)
	.then(function (user) {
		req.foundUser = user;
		next();
	})
	.then(null, next);
});
