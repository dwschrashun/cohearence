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
	return this.findOne({
		echoNestId: song.echoNestId
	})
	.then(foundSong => {
		//if song is found in collection, set request's foundSong to the songToAdd
		if (foundSong) {
			return foundSong;
		}
		//if song wasn't found, create it
		else {
			return "not found";
		}
	}).then(null, function (err) {
		console.log("ERROR In CSAC:", err);
	});
	// return new Promise(function (resolve) {
	// 	return resolve(true);
	// });
};


mongoose.model('Song', schema);
