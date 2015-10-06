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
var User = Promise.promisifyAll(mongoose.model('User'));
var Song = Promise.promisifyAll(mongoose.model('Song'));



var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

var seedSongs = function () {

    var songs = [
        {
            title: 'Jigsaw Falling Into Place',
            artist: 'Radiohead',
            youtube: {
                url: "https://www.youtube.com/watch?v=R8C2sirFYgI",
                title: "Radiohead - Jigsaw Falling Into Place (HD)",
                duration: "4:04"
            }
        },
        {
            title: 'Born to Run',
            arist: 'Bruce Springsteen',
            youtube: {
                url: "https://www.youtube.com/watch?v=IxuThNgl3YA",
                title: "Bruce Springsteen - Born to Run",
                duration: "5:33"

            }
        }
    ];

    return Song.createAsync(songs);

};

connectToDb.then(function () {
    User.remove({})
    .then(function () {
        return seedUsers();
    }).then(function () {
        return Song.remove({});
    }).then(function (){
        return seedSongs();
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).then(null, function (err) {
        console.error(err);
        process.kill(1);
    });
});
