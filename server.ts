import * as User from './server/models/user';
require('dotenv').config ();
const cors = require('cors');
const db_uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@ds061395.mlab.com:61395/power-up`;
cors();
const mongoose = require('mongoose');
console.log('db_uri', db_uri);
mongoose.connect(db_uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('Connected to database was successful!') });
const express = require('express');
const app = express();
const port = process.env.PORT ? process.env.PORT : 5000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static('public'));
app.use(express.static('vendor'));
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/landing/index.html');
});
app.get('/basic', (req, res) => {
    console.log('basic');
    res.sendFile( __dirname + '/pages/basic.html');
});
app.get('/login', (req, res) => {
    console.log('login');
    res.sendFile( __dirname + '/pages/login.html');
});
app.get('/sign-out', (req, res) => {
    console.log('sign-out');
    res.sendFile( __dirname + '/pages/sign-out.html');
});
app.get('/whos-online', (req, res) => {
    console.log('whos-online');
    res.sendFile( __dirname + '/pages/whos-online.html');
});
const socketMap = {};
const userData = {};
io.on('connection', function(socket){
    console.log('a user connected');
    actionConnected(socket);
    sendUserData();
    socket.on('disconnect', function(){
        console.log('user disconnected');
        delete socketMap[socket.id];
        console.log('this user', getUserBySocket(socket.id));
        if (   getUserBySocket(socket.id) ) {
            getUserBySocket(socket.id)['socketID'] = null;
            console.log('happened', userData);
        }
        sendUserData();
    });
    socket.on('register', function(name){
        console.log('register:', name);
        userData[name] = { socketID: socket.id, name};
        socket.emit('confirm-register', name);
        const user = new User({name});
        sendUserData();
    });
    socket.on('log-off', function(name){
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
    })
});
function getRooms(socketID) {
    return Object.keys(io.sockets.adapter.sids[socketID]);
}
function getUserBySocket(socketID) {
    return Object.values(userData).filter( user => user['socketID'] === socketID)[0];
}
http.listen(port, function(){
    console.log('listening on *:' + port);
});
function actionConnected (socket) {
    socket.emit('connected', socket.id);
    addSocketId(socket);
    sendConnectedIds();
    sendUserData();
}
function addSocketId (socket) {
    socketMap[socket.id] = socket.id;
}
function calcShowConnectedKeys () {
    return Object.keys(socketMap);
}
function sendConnectedIds () {
    io.emit('connected-ids', calcShowConnectedKeys());
}
function sendUserData () {
    io.emit('io-userData', userData);
}
