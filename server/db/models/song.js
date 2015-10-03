'use strict';
var mongoose = require('mongoose');

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


schema.statics.checkSongAgainstCollection = function(song, req, next) {
	//if it has an echoNestId, find it in Song collection
			console.log('song === ',song);
	this.findOne({
		echoNestId: song.echoNestId
	})
	.then(foundSong => {
		//if song is found in collection, set request's foundSong to the songToAdd
		if (foundSong) {
			req.foundSong = song;
			return next();
		}
		//if song wasn't found, create it
		else {
			return this.create(song)
		}
	})
}


mongoose.model('Song', schema);
