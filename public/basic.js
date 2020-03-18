const globalData = {
    pageTitle: 'Boost-UP: Landing',
    socketId: null,
    username: null,
};
const socket = io();
socket.on('connected', function (id) {
    globalData.socketId = id;
    if(getNameFromLocal()) {
        register(getNameFromLocal());
    }
});
socket.on('connected-ids', function (ids) {
    globalData.ids = ids;
});
socket.on('io-userData', function(userData){
    globalData['userData'] = userData;
});
socket.on('confirm-log-off', function(userData){
    globalData['userData'] = userData;
});
socket.on('redirect', function(path){
    if (!window.location.href.endsWith(path)) {
        window.location.href = window.location.origin + path;
    }
});
function getUserBySocket(socketID) {
    if (globalData.userData) {
        return Object.values(globalData.userData).filter( user => user.socketID === socketID)[0];
    }
}

function logOff() {
    socket.emit('log-off');
    localStorage.setItem('name', '')
}

function register(value) {
    if (value) {
        socket.emit('register', value);
        globalData.username = value;
        saveNameToLocal(value);
    }
}

function saveNameToLocal(name) {
    localStorage.setItem('name', name);
}

function getNameFromLocal() {
    return localStorage.getItem('name');
}
