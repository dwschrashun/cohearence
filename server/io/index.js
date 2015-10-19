'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        socket.on("load", function (data) {
        	console.log("load received in server", data);
        	io.sockets.emit("loadBackground", data);
        });
        socket.on("play", function (data) {
            io.sockets.emit("playBackground", data)
        });
        socket.on("pause", function (data) {
            io.sockets.emit('pauseBackground', data);
        });
        socket.on("seek", function (data) {

        });
        socket.on("songLoaded", function (data) {
        	console.log("SONG LOADED", data);
        });
        socket.on("ytError", function (data) {
        	console.log("ytError", data);
        	io.sockets.emit("ytError", data);
        })
    });

    return io;

};
