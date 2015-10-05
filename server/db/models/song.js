'use strict';
var mongoose = require('mongoose');
var Promise = require("bluebird");

var schema = new mongoose.Schema({
	title: {
		type: String
	},
	artist: {
		type: String
	},
  youtube:
	{
		url: {
			type: String,
			unique: true
		},
		title: {
			type: String
		},
		duration: {
			type: String
		}
	},
	echoNestId: {
		type: String
	}
});


schema.statics.checkSongAgainstCollection = function(song) {
	//if it has an echoNestId, find it in Song collection
	console.log("MATCHING ON: ",song.echoNestId);
	return this.findOne({
		echoNestId: song.echoNestId
	})
	.then(function (foundSong) {
		console.log("in checkSongAgainstCollection");
		//if song is found in collection, set request's foundSong to the songToAdd
		if (foundSong) {
			return foundSong;
		}
		//if song wasn't found, create it
		else {
			return "not found";
			// return this.find()
			// .then(function(allSongs){
			// 	var newSong = _.max(allSongs, function(eachSong){
			// 		return eachSong.title.score(song.title) + eachSong.artist.score(song.artist);
			// 	});
			//
			// 	if (newSong < 0 || !newSong) {
			// 		console.log('didnt find a match in our library');
			// 		// songToAdd = req.body;
			// 	}
			// })
		}
	}).then(null, function (err) {
		console.log("ERROR In CSAC:", err);
	});
	// return new Promise(function (resolve) {
	// 	return resolve(true);
	// });
};

// schema.static.checkAgainstColectionByTitle = function(song){
// 	console.log('Matching on title');
// 	return this.findOne({
// 		title: song.title, artist: song.artist
// 	})
// 	.then(function(foundSong){
// 		if (foundSong){
// 			return foundSong;
// 		}
// 		else {
// 			return "not found";
// 		}
// 	}).then(null, function(err){
// 		console.log("ERROR IN CSACBT:", err);
// 	});
// };

mongoose.model('Song', schema);
