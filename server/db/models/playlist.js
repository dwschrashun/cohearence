'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
    	type: String,
    	required: true
    },
    songs: 
        [{type: mongoose.Schema.Types.ObjectId,
        ref: "Song"}]
});

mongoose.model('Playlist', schema);
