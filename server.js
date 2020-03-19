"use strict";
exports.__esModule = true;
require("es6-shim");
require("reflect-metadata");
var User = require('./server/models/user');
console.log(User, 'user');
require('dotenv').config();
var cors = require('cors');
var db_uri = "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS + "@ds061395.mlab.com:61395/power-up";
cors();
var mongoose = require('mongoose');
console.log('db_uri', db_uri);
mongoose.connect(db_uri, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('Connected to database was successful!'); });
var express = require('express');
var app = express();
var port = process.env.PORT ? process.env.PORT : 5000;
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static('public'));
app.use(express.static('vendor'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/landing/index.html');
});
app.get('/basic', function (req, res) {
    console.log('basic');
    res.sendFile(__dirname + '/pages/basic.html');
});
app.get('/login', function (req, res) {
    console.log('login');
    res.sendFile(__dirname + '/pages/login.html');
});
app.get('/sign-out', function (req, res) {
    console.log('sign-out');
    res.sendFile(__dirname + '/pages/sign-out.html');
});
app.get('/whos-online', function (req, res) {
    console.log('whos-online');
    res.sendFile(__dirname + '/pages/whos-online.html');
});
var socketMap = {};
var userData = {};
io.on('connection', function (socket) {
    console.log('a user connected');
    actionConnected(socket);
    sendUserData();
    socket.on('disconnect', function () {
        console.log('user disconnected');
        delete socketMap[socket.id];
        console.log('this user', getUserBySocket(socket.id));
        if (getUserBySocket(socket.id)) {
            getUserBySocket(socket.id)['socketID'] = null;
            console.log('happened', userData);
        }
        sendUserData();
    });
    socket.on('register', function (name) {
        console.log('register:', name);
        userData[name] = { socketID: socket.id, name: name };
        socket.emit('confirm-register', name);
        console.log(User);
        var user = new User({ name: name });
        sendUserData();
    });
    socket.on('log-off', function (name) {
        console.log('log off:', name);
        console.log(name);
        if (userData[name]) {
            userData[name].socketID = null;
        }
        socket.emit('confirm-log-off', name);
        socket.emit('redirect', '/login');
        sendUserData();
    });
    socket.on('request-redirect', function (path) {
        socket.emit('redirect', path);
    });
});
function getRooms(socketID) {
    return Object.keys(io.sockets.adapter.sids[socketID]);
}
function getUserBySocket(socketID) {
    return Object.values(userData).filter(function (user) { return user['socketID'] === socketID; })[0];
}
http.listen(port, function () {
    console.log('listening on *:' + port);
});
function actionConnected(socket) {
    socket.emit('connected', socket.id);
    addSocketId(socket);
    sendConnectedIds();
    sendUserData();
}
function addSocketId(socket) {
    socketMap[socket.id] = socket.id;
}
function calcShowConnectedKeys() {
    return Object.keys(socketMap);
}
function sendConnectedIds() {
    io.emit('connected-ids', calcShowConnectedKeys());
}
function sendUserData() {
    io.emit('io-userData', userData);
}
