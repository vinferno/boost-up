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

const socketMap = {

};



io.on('connection', function(socket){

    console.log('a user connected');
    actionConnected(socket);

    socket.on('disconnect', function(){
        console.log('user disconnected');
        delete socketMap[socket.id];
        console.log('unknown connections:', calcShowConnectedKeys() );
    });
    socket.on('register', function(msg){
        console.log('user register');
        console.log('unknown connections:', calcShowConnectedKeys() );
        socket.emit('second', msg)
    });

});

http.listen(port, function(){
    console.log('listening on *:' + port);
});


function actionConnected (socket) {
    socket.emit('connected', socket.id);
    addSocketId(socket);
    socket.emit('connected-ids', calcShowConnectedKeys());
}
function addSocketId (socket) {
    socketMap[socket.id] = socket.id;
}
function calcShowConnectedKeys () {
    return Object.keys(socketMap);
}
