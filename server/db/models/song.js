'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	title: {
		type: String
	},
	artist: {
		type: String
	},
	echoNestId: {
		type: String
	},
    youtube:
	[
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
		}
	],
	soundcloud:
	[
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
		}
	],
	bandcamp:
	[
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
		}
	],
	spotify:
	[
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
		}
	]
});



mongoose.model('Song', schema);
