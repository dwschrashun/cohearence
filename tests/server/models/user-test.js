var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);
var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');
require('../../../server/db/models');
var Song = mongoose.model('Song');
var User = mongoose.model('User');
var Playlist = mongoose.model('Playlist');
var supertest = require('supertest');
var app = require('../../../server/app');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var _ = require('lodash');
var chalk = require('chalk');
var deepPopulate = require("mongoose-deep-populate")(mongoose);
// Require in all models.
require('../../../server/db/models');


describe('User model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    xit('should exist', function () {
        expect(User).to.be.a('function');
    });

    describe('password encryption', function () {

        describe('generateSalt method', function () {

            xit('should exist', function () {
                expect(User.generateSalt).to.be.a('function');
            });

            xit('should return a random string basically', function () {
                expect(User.generateSalt()).to.be.a('string');
            });

        });

        describe('encryptPassword', function () {

            var cryptoStub;
            var hashUpdateSpy;
            var hashDigestStub;
            beforeEach(function () {

                cryptoStub = sinon.stub(require('crypto'), 'createHash');

                hashUpdateSpy = sinon.spy();
                hashDigestStub = sinon.stub();

                cryptoStub.returns({
                    update: hashUpdateSpy,
                    digest: hashDigestStub
                });

            });

            afterEach(function () {
                cryptoStub.restore();
            });

            xit('should exist', function () {
                expect(User.encryptPassword).to.be.a('function');
            });

            xit('should call crypto.createHash with "sha1"', function () {
                User.encryptPassword('asldkjf', 'asd08uf2j');
                expect(cryptoStub.calledWith('sha1')).to.be.ok;
            });

            xit('should call hash.update with the first and second argument', function () {

                var pass = 'testing';
                var salt = '1093jf10j23ej===12j';

                User.encryptPassword(pass, salt);

                expect(hashUpdateSpy.getCall(0).args[0]).to.be.equal(pass);
                expect(hashUpdateSpy.getCall(1).args[0]).to.be.equal(salt);

            });

            xit('should call hash.digest with hex and return the result', function () {

                var x = {};
                hashDigestStub.returns(x);

                var e = User.encryptPassword('sdlkfj', 'asldkjflksf');

                expect(hashDigestStub.calledWith('hex')).to.be.ok;
                expect(e).to.be.equal(x);

            });

        });

        describe('on creation', function () {

            var encryptSpy;
            var saltSpy;

            var createUser = function () {
                return User.create({ email: 'obama@gmail.com', password: 'potus' });
            };

            beforeEach(function () {
                encryptSpy = sinon.spy(User, 'encryptPassword');
                saltSpy = sinon.spy(User, 'generateSalt');
            });

            afterEach(function () {
                encryptSpy.restore();
                saltSpy.restore();
            });

            xit('should call User.encryptPassword with the given password and generated salt', function (done) {
                createUser().then(function () {
                    var generatedSalt = saltSpy.getCall(0).returnValue;
                    expect(encryptSpy.calledWith('potus', generatedSalt)).to.be.ok;
                    done();
                });
            });

            xit('should set user.salt to the generated salt', function (done) {
               createUser().then(function (user) {
                   var generatedSalt = saltSpy.getCall(0).returnValue;
                   expect(user.salt).to.be.equal(generatedSalt);
                   done();
               });
            });

            xit('should set user.password to the encrypted password', function (done) {
                createUser().then(function (user) {
                    var createdPassword = encryptSpy.getCall(0).returnValue;
                    expect(user.password).to.be.equal(createdPassword);
                    done();
                });
            });

        });

    });
        describe('Methods', function () {
          var user1, user2, playlist1;
          var guest;
          var song1, song2, song3;
          beforeEach('Create test songs', function(done){
            Song.create([
              {
                title: 'King of the South',
                artist: 'Big Krit'
      	  },
              {
                title: 'Stairway to Heaven',
                artist: 'Led Zeppelin',
      		      echoNestId: 'SODFHPG12B0B80B0A4'
      	  },
          {
            title: 'Stairway to Heaven',
            artist: 'Led Zeppelin'
          },
      		{
      			title: 'Clint Eastwood', //this song will be in our library but not the users
      			artist: 'Gorillaz',
      			echoNestId: 'SOHXAFX13AF726A4C1'
      		}
            ])
            .then(function(songs){
              [song1, song2, song3] = songs;
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

          beforeEach('Create a test playlist', function(done){
        		guest = supertest.agent(app);
        		Playlist.create([
        			{
                user: user1._id,
                name: 'testPlaylist'
              }
        		])
        		.then(function(playlist){
        			playlist1 = playlist;
              done();
        		});
          });

      	});

          it('findMatchIndex should return the index of the song if the echonest id'
          + ' is in the user library', function(done){
            this.timeout(1000);
            user1.deepPopulate('musicLibrary.song', function(err, user){
              var returnedIndex1 = user.findMatchIndex(song1);
              expect(returnedIndex1).to.be.equal(0);
              var returnedIndex2 = user.findMatchIndex(song2);
              expect(returnedIndex2).to.equal(1);
            });
            done();
          });

          it('findMatchIndex should return a song with a score over '
          + '75 when the echonest id is not found', function(done){
            user1.deepPopulate('musicLibrary.song', function(err, user){
              var returnedIndex = user.findMatchIndex(song3);
              expect(returnedIndex).to.equal(1);
            });
            done();
          });

      });

});
