'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	title: {
		type: String,
		default: "unknown"
	},
	artist: {
		type: String,
		default: "unknown"
	},
	source: {
		domain: {
			type: String,
			enum: ['YouTube', 'Spotify', 'Soundcloud', 'Bandcamp']
		},
		url: {
			type: String
		},
		videoTitle: {
			type: String
		},
		bandcampId: {
			type: String
		},
		fakeUrl: {
			type: String
		}
	},
	echoNestId: {
		type: String
	},
	duration: {
		type: String
	},
});
mongoose.model('Song', schema);
