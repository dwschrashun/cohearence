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
	.then(users => {
		users = users.map(user => _.omit(user.toJSON(), ['salt', 'password']));
		res.json(users);
	});
});

router.get('/:userId', function (req, res) {
	res.json(_.omit(req.foundUser.toJSON(), ['salt', 'password']));
});

router.get('/:userId/library', function (req, res, next) {
	User.deepPopulate(req.foundUser, 'musicLibrary.song', function (err, populated) {
		if (err) next(err);
		else res.json(populated.musicLibrary);
	});
});

router.delete('/:userId/library/:songObjId', function(req,res,next){
	User.findById(req.params.userId)
	.then(function(user){
		user.musicLibrary.forEach(function(songObj, i){
			if (songObj.song.toString() === req.params.songObjId){
				user.musicLibrary.splice(i, 1);
			}
		});
		user.save().then( () => res.status(204).end() );
	});
});

function fuzzySearch(echoNestSongs, artist, title){
	var artistMax = 0, titleMax = 0, bestMatch = echoNestSongs[0];
	echoNestSongs.forEach(function(echoNestSong) {
		echoNestSong.titleScore = title.score(echoNestSong.title);
		echoNestSong.artistScore = artist.score(echoNestSong.artist_name);
		if ((echoNestSong.titleScore + echoNestSong.artistScore) > (titleMax + artistMax ) && echoNestSong.titleScore > 0.75 && echoNestSong.artistScore > 0.75) {
			titleMax = echoNestSong.titleScore;
			artistMax = echoNestSong.artistScore;
			bestMatch = echoNestSong;
		}
	});
	return bestMatch;
}
function checkEchoNest(body){
	return new Promise(function(resolve, reject){
		echo("song/search").get({artist: body.artist, title: body.title}, function(err, json){
			if (err) console.log("ERROR: ",err);
			else if (json.response.status.message === "Success" && json.response.songs.length > 0){
				var bestMatch = fuzzySearch(json.response.songs, body.artist, body.title);
        body.title = bestMatch.title;
        body.artist = bestMatch.artist;
        body.echoNestId = bestMatch.echoNestId;
				return resolve(body);
			} else {
				return resolve(body);
			}
		});
	});
}

function formatSongFromReqBody(reqBody){
	var title = reqBody.title || "unknown";
	var artist = reqBody.artist || "unknown";
	var duration = reqBody.duration || "";
	var source = reqBody.source || {
		domain: null,
		url: null,
		videoTitle: null,
		bandcampId: null,
		spotifyUrl: null,
		sourceUrl: null
	};
		var newSongObj = {
			title: title,
			artist: artist,
			duration: duration,
			source: source
		};
		return newSongObj;
}

//#1 Search in EchoNest
router.put('/:userId/library', function(req, res, next){
	checkEchoNest(req.body)
	.then(match => req.body = match)
  next();
});

//#2 Search in our library
router.put('/:userId/library', function(req, res, next){
  var searchParams = {};
  req.body.echoNestId ? searchParams = {echoNestId: req.body.echoNestId} :
  searchParams = {'source.url': req.body.source.url};
  Song.findOne(searchParams).then(foundSong => {
      if(foundSong) req.songToSave = foundSong;
      else {
        return Song.create(formatSongFromReqBody(req.body))
        .then(createdSong => req.songToSave = createdSong)
      }
  }).then(next());
});

//#3 finally, add it to the user
router.put('/:userId/library', function (req, res, next) {
  User.populateMusicLibrary(req.foundUser).then(() => {
    req.foundUser.addToLibraryOrUpdate(req.songToSave);
    User.populateMusicLibrary(req.foundUser)
    .then(() => {
      res.status(201).json(req.foundUser.musicLibrary)
    })
  }).then(null, next);
});



router.param('userId', function (req, res, next, userId) {
	User.findById(userId).deepPopulate("musicLibrary.song").exec(function (err, populated) {
		if (err) {
			next(err);
		}
		else {
			req.foundUser = populated;
			next();
		}
	});
});
