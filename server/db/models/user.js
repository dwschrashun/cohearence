'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
require("string_score");

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
		type: [{song: {type: mongoose.Schema.Types.ObjectId, ref: 'Song'}, plays: [{type: Date}]}]
	}
});

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

schema.method('addToLibrary', function(newSong, index){
	if (index !== -1) {
		this.musicLibrary[index].plays.push(new Date());
	} else {
		this.musicLibrary.push({song: newSong, plays: [new Date()]});
	}
});

schema.statics.populateMusicLibrary = function(user) {
	return this.populate(user, 'musicLibrary.song').exec()
}

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
}



mongoose.model('User', schema);
