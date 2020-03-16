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


io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});


