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

mongoose.model('Song', schema);
