var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var Playlist = mongoose.model('Playlist');

router.post('/', function(req,res,next){
	console.log("user: ",req.user);
	Playlist.create({user: req.user, name: req.body.name})
	.then(function(playlist){
		console.log(playlist);
		res.json(playlist);
	}).then(null, console.log);
});

router.get('/user', function(req,res,next){
	Playlist.find({user: req.user._id})
	.then(function(playlists){
		res.json(playlists);
	}).then(null,next);
});

router.put('/', function(req,res,next){
	var playlistId = req.body.playlist;
	Playlist.findById(playlistId)
	.then(function(playlist){
		playlist.songs.push(req.body.song);
		playlist.save()
		.then(function(savedPlaylist){
			console.log(savedPlaylist);
			res.json(savedPlaylist);
		});
	});
});
