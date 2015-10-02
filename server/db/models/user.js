'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

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

schema.method('addToLibrary', function(songToAdd){
	console.log("Song to ad in user.addtoLibrary: " , songToAdd);
	this.musicLibrary.push({song: songToAdd, plays: new Date()});
	this.save().then(function(savedUser){
		console.log("updated music library:" , savedUser);
	});
});

mongoose.model('User', schema);
