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
			musicLibrary:
			[
				{
					song: {
					  "duration": "13:42",
					  "echoNestId": "SOKYVNQ13D66C7C450",
					  "source": {
					    "url": "sOnqjkJTMaA",
					    "videoTitle": "Michael Jackson - Thriller",
					    "domain": "YouTube",
					    "sourceUrl": "https://www.youtube.com/watch?v=sOnqjkJTMaA"
					  },
					  "artist": "Michael Jackson",
					  "title": "Thriller",
					},
					plays :[

					]
				},
				{
					song: {
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
					plays :[

					]
				},
				{
					song: {
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
					plays :[

					]
				},
				{
					song: {
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
					plays :[

					]
				},
				{
					song: {
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
					plays :[

					]
				},
				{
					song: {
						"duration": "03:37",
			  		  "source": {
			  		    "domain": "Bandcamp",
			  		    "url": "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=d96e73221ba767641799a400c6549920&id=2193158644&stream=1&ts=1445021001.0",
			  		    "videoTitle": "TipperIts Like",
			  		    "sourceUrl": "https://tipper.bandcamp.com/album/its-like?from=discover-top",
			  		    "bandcampId": "2193158644"
			  		  },
			  		  "artist": "Tipper",
			  		  "title": "Its Like",
					},
					plays :[

					]
				},
				{
					song: {
						"duration": "04:20",
			  		  "source": {
			  		    "domain": "Bandcamp",
			  		    "url": "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=a2d327a580dc8b272e3343a7fc45b737&id=3155740019&stream=1&ts=1444867607.0",
			  		    "videoTitle": "KOOL A.D.THE FRONT (FEAT. TORO Y MOI & AMAZE 88) (PROD. TORO Y MOI)",
			  		    "sourceUrl": "/track/the-front-feat-toro-y-moi-amaze-88-prod-toro-y-moi",
			  		    "bandcampId": "3155740019"
			  		  },
			  		  "artist": "KOOL A.D.",
			  		  "title": "THE FRONT (FEAT. TORO Y MOI & AMAZE 88) (PROD. TORO Y MOI)",
					},
					plays :[

					]
				},
				{
					song: {
						"duration": "4:21",
			  		  "echoNestId": "SOJDJMU1445759030B",
			  		  "source": {
			  		    "url": "bDktBZzQIiU",
			  		    "videoTitle": "Johnny Cash - Folsom Prison Blues (Live)",
			  		    "domain": "YouTube",
			  		    "sourceUrl": "https://www.youtube.com/watch?v=bDktBZzQIiU"
			  		  },
			  		  "artist": "Johnny Cash",
			  		  "title": "Folsom Prison Blues (Live)",
					},
					plays :[

					]
				},
				{
					song: {
						"duration": "3:59",
			  		  "echoNestId": "SOVMGEX12AC9070FF2",
			  		  "source": {
			  		    "url": "S7q_12tYZdA",
			  		    "videoTitle": "Van Halen - Jump",
			  		    "domain": "YouTube",
			  		    "sourceUrl": "https://www.youtube.com/watch?v=S7q_12tYZdA"
			  		  },
			  		  "artist": "Van Halen",
			  		  "title": "Jump",
					},
					plays :[

					]
				},
				{
					song: {
						"duration": "3:47",
			  		  "source": {
			  		    "url": "djV11Xbc914",
			  		    "videoTitle": "a-ha - Take On Me (Official Video)",
			  		    "domain": "YouTube",
			  		    "sourceUrl": "https://www.youtube.com/watch?v=djV11Xbc914"
			  		  },
			  		  "artist": "a-ha",
			  		  "title": "Take On Me (Official Video)",
					},
					plays :[

					]
				},
				{
					song: {
						"duration": "3:00",
			  		  "echoNestId": "SODJFHB1312A8A74DE",
			  		  "source": {
			  		    "url": "QHpU0ZfXZ_g",
			  		    "videoTitle": "Reel Big Fish - Take On Me",
			  		    "domain": "YouTube",
			  		    "sourceUrl": "https://www.youtube.com/watch?v=QHpU0ZfXZ_g"
			  		  },
			  		  "artist": "Reel Big Fish",
			  		  "title": "Take On Me",
					},
					plays :[

					]
				},
				{
					song: {
					  "duration": "13:42",
					  "echoNestId": "SOKYVNQ13D66C7C450",
					  "source": {
						"url": "sOnqjkJTMaA",
						"videoTitle": "Michael Jackson - Thriller",
						"domain": "YouTube",
						"sourceUrl": "https://www.youtube.com/watch?v=sOnqjkJTMaA"
					  },
					  "artist": "Michael Jackson",
					  "title": "Thriller",
					},
					plays :[

					]
				},
				{
					song: {
						"duration": "3:38",
			  		  "echoNestId": "SOPCVAI1461525F5ED",
			  		  "source": {
			  		    "url": "p-qfzH0vnOs",
			  		    "videoTitle": "Goldfinger - 99 Red Balloons",
			  		    "domain": "YouTube",
			  		    "sourceUrl": "https://www.youtube.com/watch?v=p-qfzH0vnOs"
			  		  },
			  		  "artist": "Goldfinger",
			  		  "title": "99 Red Balloons",
					},
					plays :[

					]
				},


			]
		}
    ];

    return User.createAsync(users);

};

var seedSongs = function () {

    var songs = [
		{
		  "duration": "13:42",
		  "echoNestId": "SOKYVNQ13D66C7C450",
		  "source": {
		    "url": "sOnqjkJTMaA",
		    "videoTitle": "Michael Jackson - Thriller",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=sOnqjkJTMaA"
		  },
		  "artist": "Michael Jackson",
		  "title": "Thriller",
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
		    "url": "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=d96e73221ba767641799a400c6549920&id=2193158644&stream=1&ts=1445021001.0",
		    "videoTitle": "TipperIts Like",
		    "sourceUrl": "https://tipper.bandcamp.com/album/its-like?from=discover-top",
		    "bandcampId": "2193158644"
		  },
		  "artist": "Tipper",
		  "title": "Its Like",
	  },
		{
		  "duration": "03:37",
		  "source": {
		    "domain": "Bandcamp",
		    "url": "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=9735b4b11daa2868904185d3750114b0&id=2193158644&stream=1&ts=1444949711.0",
		    "videoTitle": "TipperIts Like",
		    "sourceUrl": "/track/its-like",
		    "bandcampId": "2193158644"
		  },
		  "artist": "Tipper",
		  "title": "Its Like",
	  },
		{
		  "duration": "04:20",
		  "source": {
		    "domain": "Bandcamp",
		    "url": "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=a2d327a580dc8b272e3343a7fc45b737&id=3155740019&stream=1&ts=1444867607.0",
		    "videoTitle": "KOOL A.D.THE FRONT (FEAT. TORO Y MOI & AMAZE 88) (PROD. TORO Y MOI)",
		    "sourceUrl": "/track/the-front-feat-toro-y-moi-amaze-88-prod-toro-y-moi",
		    "bandcampId": "3155740019"
		  },
		  "artist": "KOOL A.D.",
		  "title": "THE FRONT (FEAT. TORO Y MOI & AMAZE 88) (PROD. TORO Y MOI)",
	  },
		{
		  "duration": "4:21",
		  "echoNestId": "SOJDJMU1445759030B",
		  "source": {
		    "url": "bDktBZzQIiU",
		    "videoTitle": "Johnny Cash - Folsom Prison Blues (Live)",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=bDktBZzQIiU"
		  },
		  "artist": "Johnny Cash",
		  "title": "Folsom Prison Blues (Live)",
	  },
		{
		  "duration": "3:59",
		  "echoNestId": "SOVMGEX12AC9070FF2",
		  "source": {
		    "url": "S7q_12tYZdA",
		    "videoTitle": "Van Halen - Jump",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=S7q_12tYZdA"
		  },
		  "artist": "Van Halen",
		  "title": "Jump",
	  },
		{
		  "duration": "3:47",
		  "source": {
		    "url": "djV11Xbc914",
		    "videoTitle": "a-ha - Take On Me (Official Video)",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=djV11Xbc914"
		  },
		  "artist": "a-ha",
		  "title": "Take On Me (Official Video)",
	  },
		{
		  "duration": "3:00",
		  "echoNestId": "SODJFHB1312A8A74DE",
		  "source": {
		    "url": "QHpU0ZfXZ_g",
		    "videoTitle": "Reel Big Fish - Take On Me",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=QHpU0ZfXZ_g"
		  },
		  "artist": "Reel Big Fish",
		  "title": "Take On Me",
	  },
		{
		  "duration": "3:38",
		  "echoNestId": "SOPCVAI1461525F5ED",
		  "source": {
		    "url": "p-qfzH0vnOs",
		    "videoTitle": "Goldfinger - 99 Red Balloons",
		    "domain": "YouTube",
		    "sourceUrl": "https://www.youtube.com/watch?v=p-qfzH0vnOs"
		  },
		  "artist": "Goldfinger",
		  "title": "99 Red Balloons",
	  }
	]


    return Song.createAsync(songs);

};

connectToDb.then(function () {
    User.remove({})
    .then(function () {
        return seedUsers();
    }).then(function () {
        return Song.remove({});
	}).then(function(){
		// seedSongs();
	// }).then(function(songs){
	// 	return User.find({email:"ringo@fsa.com"}).exec()
	// 	.then(function(user){
	// 			console.log("USER:", user);
	// 		songs.forEach(function(theSong){
	// 			console.log("SONG:", theSong);
	// 			// user.musicLibrary.push({song: theSong._id, plays: [new Date()]});
	// 		})
	// 		return user.save();
	// 	})
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).then(null, function (err) {
        console.error(err);
        process.kill(1);
    });
});
