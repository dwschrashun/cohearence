'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
require("string_score");
var deepPopulate = require("mongoose-deep-populate")(mongoose);
var Promise = require("bluebird");

var schema = new mongoose.Schema({
	email: {
		type: String
	},
	password: {
		type: String
	},
	salt: {
		type: String
	},
	facebook: {
		id: String
	},
	google: {
		id: String
	},
	musicLibrary: {
		type: [{song: {type: mongoose.Schema.Types.ObjectId, ref: 'Song'}, plays: [{type: Date}]}], default: [],
	}
});

schema.plugin(deepPopulate);

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
	return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
	var hash = crypto.createHash('sha1');
	hash.update(plainText);
	hash.update(salt);
	return hash.digest('hex');
};

schema.pre('save', function (next) {
	if (this.isModified('password')) {
		this.salt = this.constructor.generateSalt();
		this.password = this.constructor.encryptPassword(this.password, this.salt);
	}
	next();
});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
	return encryptPassword(candidatePassword, this.salt) === this.password;
});

//adds song to user's library if song is not found in user's library
//if song is found in user's library, add a new timestamp
schema.method('addToLibraryOrUpdate', function(newSong, index){
	if (index !== -1) {
		this.musicLibrary[index].plays.push(new Date());
	} else {
		this.musicLibrary.push({song: newSong, plays: [new Date()]});
	}
});

schema.statics.populateMusicLibrary = function(user) {
	var self = this;
	return new Promise (function (resolve, reject) {
		self.deepPopulate(user, 'musicLibrary.song', function (err, populated) {
			if (err) {
				console.log("DP ERROR", err);
				return reject(err);
			}
			//console.log("populated", populated);
			return resolve(populated);
		});
	});
};

schema.methods.findMatchIndex = function(songToAdd) {
	//find index of song that matches songToAdd in user's music library
	//if songToAdd doesn't have echoNestId, find the song that
	//matches at least .75
	return _.findIndex(this.musicLibrary, function(el) {
		if (songToAdd.echoNestId) {
			return el.song.echoNestId === songToAdd.echoNestId;
		} else {
			theScore = el.song.title.score(songToAdd.title);
			return theScore >= .75;
		}
	});
};



mongoose.model('User', schema);
