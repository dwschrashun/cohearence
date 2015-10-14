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
        }
    ];

    return User.createAsync(users);

};

// var seedSongs = function () {
//
//     var songs = [
//         {
//         }
//     ];
//
//     return Song.createAsync(songs);
//
// };

connectToDb.then(function () {
    User.remove({})
    .then(function () {
        return seedUsers();
    }).then(function () {
        return Song.remove({});
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).then(null, function (err) {
        console.error(err);
        process.kill(1);
    });
});
