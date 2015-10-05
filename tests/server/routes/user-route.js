var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var chai = require('chai');
var expect = chai.expect;
var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);
var supertest = require('supertest');
var app = require('../../../server/app');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var _ = require('lodash');

chai.should();
chai.use(sinonChai);

describe('User route', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });


    var guest;
    var user1, user2;
    var song1, song2;


    beforeEach('Create test songs', function(done){
      Song.create([
        {
          title: 'King of the South',
          artist: 'Big Krit',
          youtube: {url:'1'}
        },
        {
          title: 'Stairway to Heaven',
          artist: 'Led Zeppelin',
          youtube: {url:'2'},
		  echoNestId: 'SODFHPG12B0B80B0A4'
		},
		{
			title: 'Coffe & TV',
			artist: 'Blur',
			youtube: {url: '7'}
		}
      ])
      .then(function(songs){
        [song1, song2] = songs;
        done();
      }).then(null,console.log);
    });

    beforeEach('Create a test user', function(done){
      guest = supertest.agent(app);
      User.create([
        {
          email: 'user1@test.com',
          musicLibrary:
          [
            {song: song1._id, plays: [new Date()]},
            {song: song2._id, plays: [new Date()]}
          ],
        },
        {
          email: 'user2@test.com',
          musicLibrary: [],
        }
    ])
      .then(function(createdUsers){
        user1 = createdUsers[0];
        user2 = createdUsers[1];
        done();
      });
    });


    // afterEach('Clear test database', function (done) {
    //     clearDB(done);
    // });

    describe('Get ', function(){
      it('returns a list of all users', function(done){
        guest.get('/api/users')
        .expect(200)
        .end(function(err, response){
          if (err) return done(err);
          expect(response.body.length).to.equal(2);
          done();
        });
      });

      it('gets a single user', function(done){
        guest.get(`/api/users/${user1._id}`)
        .expect(200)
        .end(function(err, response){
          if (err) return done(err);
          //expect(Array.isArray(response.body)).to.be.false;
          expect(response.body.email).to.equal('user1@test.com');
          done();
        });
      });

      it("gets a user's library", function(done){
        guest.get(`/api/users/${user1._id}/library`)
        .expect(200)
        .end(function(err, response){
          if (err) return done(err);
          expect(response.body.musicLibrary.length).to.equal(2);
          expect(response.body.musicLibrary[0].song.title).to.equal('King of the South');
          expect(response.body.musicLibrary[0].plays.length).to.equal(1);
          expect(response.body.musicLibrary[1].song.title).to.equal('Stairway to Heaven');
          done();
        });
      });
    });

//here is the big one boys
	describe('put ', function(){


		//a song that is not in our main library or the users library
		var newSong = {
			title: 'Wonderwall',
			artist: 'Oasis',
			youtube: {url:'3'}
		};

		it('returns a changed library when adding a new song', function(done){
			guest.put(`/api/users/${user1._id}/library`)
			.send(newSong)
			.expect(201)
			.end(function(err, response){
				if (err) return done(err);
				expect(response.body.length).to.equal(3);
				var test = _.findIndex(response.body, element => element.song.title === 'Wonderwall');
				expect(test).to.be.above(-1);
				Song.find({title: "Wonderwall"}) //also expect it to be in our general library
				.then(function(foundSong){
					expect(foundSong).to.exist;
					done();
				});
			});
		});

		//a song that the user does not have but is in our library
		var librarySong = {
			title: 'Coffe & TV',
			artist: 'Blur',
			youtube: {url: '7'}
		}
		// it('adds to the user a song from our library if its already there', function(done){
		// 	guest.put(`/api/users/${user1._id}/library`)
		// 	.send(oldSong)
		// 	.expect(201)
		// 	.end(function(err, response){
		// 		if (err) return done(err);
		// 		expect(response.body.length).to.equal(2);
		// 		// var test = _.findIndex(response.body, element => element.song.title === 'Wonderwall');
		// 		// expect(test).to.be.above(-1);
		// 		Song.find({title: "Stairway to Heaven"}) //also expect it to be in our general library
		// 		.then(function(foundSong){
		// 			expect(foundSong).to.exist;
		// 			done();
		// 		});
		// 	});
		// });

		//a song that the user already has in his library
		var oldSong = {
			title: 'Stairway to Heaven',
			artist: 'Led Zeppelin',
			youtube: {url:'2'}
		};

		it('returns an updated play count when adding a song already in their library', function(done){
			guest.put(`/api/users/${user1._id}/library`)
			.send(oldSong)
			.expect(201)
			.end(function(err, response){
				if (err) return done(err);
				expect(response.body.length).to.equal(2);
				expect(response.body[response.body.length-1].plays.length).to.equal(2);
				console.log("RES BODY: ",response.body);
				done();
			});
		});

		//test for misspelled song names
		var misspelledSong = {
			title: 'starway to heaven',
			artist: 'Led Zepelin',
			youtube: {url: '4'}
		}


		//test for songs that are not findable in echonest
		var obscureSong = {
			title: 'High',
			artist: 'Tom Misch',
			youtube: {url: '5'}
		}
	});
});
