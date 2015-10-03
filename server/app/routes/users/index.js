var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var echojs = require('echojs');
var echo = echojs({
  key: process.env.ECHONEST_KEY
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
	// echo("song/search").get({
	// 	artist: req.body.artist,
	// 	title: req.body.title
	// }, function (err, json) {
	// 	if (json.response.status.message === "Success") {
	// 		res.json(json);
	// 	}
	// });

	//for testing
	console.log('got to the server route');
	res.json(req.body);

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
