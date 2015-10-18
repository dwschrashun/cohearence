/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var Promise = require("bluebird");
var User = Promise.promisifyAll(mongoose.model('User'));
var Song = Promise.promisifyAll(mongoose.model('Song'));



var seedUsers = function () {

    var users = [
        {
            email: 'test@test.com',
            password: '123'
        },
		{
			email: 'ringo@starr.com',
			password: '123',
			musicLibrary: []
		}
    ];

    return User.createAsync(users);

};

var seedSongs = function () {

    var songs = [
		{
		  "duration": "10:00",
		  "echoNestId": "SOIFNAX144AD11923D",
		  "source": {
		    "url": "poXvMBhjSWk",
		    "videoTitle": "The Rolling Stones - (I Can't Get No) Satisfaction - Glastonbury 2013 (HD)",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=poXvMBhjSWk"
		  },
		  "artist": "The Rolling Stones",
		  "title": "(I Can't Get No) Satisfaction",
		},
		{
		  "duration": "5:34",
		  "source": {
		    "url": "lEwh1JsJwRk",
		    "videoTitle": "Andrew von Oeyen - \"Clair de lune \" by Debussy",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=lEwh1JsJwRk"
		  },
		  "artist": "Andrew von Oeyen",
		  "title": "\"Clair de lune \" by Debussy",
	  },
		{
		  "duration": "3:40",
		  "echoNestId": "SOJDXZR144B4D1AC98",
		  "source": {
		    "url": "7kDGi8gYS18",
		    "videoTitle": "Aretha Franklin - Respect",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=7kDGi8gYS18"
		  },
		  "artist": "Aretha Franklin",
		  "title": "Respect",
	  },
	  {
		  "duration": "3:23",
		  "echoNestId": "SOWVGAI1474557A5AE",
		  "source": {
		    "url": "https://soundcloud.com/dukedumont/wont-look-back",
		    "videoTitle": "Won't Look Back",
		    "domain": "Soundcloud",
		    "bandcampId": "",
		    "sourceUrl": "https://soundcloud.com/dukedumont/wont-look-back"
		  },
		  "artist": "Duke Dumont",
		  "title": "Won't Look Back",
		},
		{
		  "duration": "4:56",
		  "source": {
		    "url": "https://soundcloud.com/kygo/of-monster-and-men-dirty-paws-kygo-remix",
		    "videoTitle": "Of Monsters And Men - Dirty Paws (Kygo Remix)",
		    "domain": "Soundcloud",
		    "bandcampId": "",
		    "sourceUrl": "https://soundcloud.com/kygo/of-monster-and-men-dirty-paws-kygo-remix"
		  },
		  "artist": "Of Monsters And Men",
		  "title": "Dirty Paws (Kygo Remix)",
	  },
		{
		  "duration": "4:35",
		  "echoNestId": "SOXCWZO14FF274FB81",
		  "source": {
		    "url": "https://soundcloud.com/maddecent/troyboi-afterhours-feat-diplo-nina-sky",
		    "videoTitle": "TroyBoi - Afterhours (feat. Diplo & Nina Sky)",
		    "domain": "Soundcloud",
		    "bandcampId": "",
		    "sourceUrl": "https://soundcloud.com/maddecent/troyboi-afterhours-feat-diplo-nina-sky"
		  },
		  "artist": "TroyBoi",
		  "title": "Afterhours feat. Diplo & Nina Sky",
	  },
		{
		  "duration": "03:37",
		  "source": {
		    "domain": "Bandcamp",
		    "url": "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=9735b4b11daa2868904185d3750114b0&id=2193158644&stream=1&ts=1444949711.0",
		    "videoTitle": "TipperIts Like",
		    "sourceUrl": "http://tipper.bandcamp.com/album/its-like",
		    "bandcampId": "2193158644"
		  },
		  "artist": "Tipper",
		  "title": "Its Like",
	  },
	  {
		  "duration": "3:54",
		  "echoNestId": "SOYOZZH12AB017D44E",
		  "source": {
		    "url": "pdG1oRvoQv4",
		    "videoTitle": "Dispatch - Passerby",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=pdG1oRvoQv4"
		  },
		  "artist": "Dispatch",
		  "title": "Passerby",
		},
		{
		  "duration": "04:20",
		  "source": {
		    "domain": "Bandcamp",
		    "url": "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=a2d327a580dc8b272e3343a7fc45b737&id=3155740019&stream=1&ts=1444867607.0",
		    "videoTitle": "KOOL A.D.THE FRONT (FEAT. TORO Y MOI & AMAZE 88) (PROD. TORO Y MOI)",
		    "sourceUrl": "http://koolad.bandcamp.com/track/the-front-feat-toro-y-moi-amaze-88-prod-toro-y-moi",
		    "bandcampId": "3155740019"
		  },
		  "artist": "KOOL A.D.",
		  "title": "THE FRONT (FEAT. TORO Y MOI & AMAZE 88) (PROD. TORO Y MOI)",
	  },
		{
			"duration": "3:25",
			"echoNestId": "SOJAWKP13F851465B7",
			"source": {
			  "url": "dw6qJWime_Y",
			  "videoTitle": "Miniboone - I Could, I Could",
			  "domain": "YouTube",
			  "sourceUrl": "https://www.youtube.com/watch?v=dw6qJWime_Y"
			},
			"artist": "Miniboone",
			"title": "I Could, I Could",
		},
		{
		  "duration": "4:02",
		  "echoNestId": "SODGMGX1444FF662D3",
		  "source": {
		    "url": "tCnBrrnOefs",
		    "videoTitle": "Justice - D.A.N.C.E. - †",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=tCnBrrnOefs"
		  },
		  "artist": "Justice",
		  "title": "D.A.N.C.E.",
		}
	];


    return Song.createAsync(songs);

};

connectToDb.then(function () {
    User.remove({})
    .then(function () {
        return seedUsers();
    }).then(function (users) {
        return Song.remove({});
	}).then(function(){
		return seedSongs();
	}).then(function(songs){
		return User.findOne({email:"ringo@starr.com"}).exec()
		.then(function(user){
			songs.forEach(function(theSong){
				user.musicLibrary.push({song: theSong._id, plays: [new Date()]});
			});
			return user.save();
		});
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).then(null, function (err) {
        console.error(err);
        process.kill(1);
    });
});
