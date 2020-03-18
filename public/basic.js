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
function getUserBySocket(socketID) {
    if (globalData.userData) {
        return Object.values(globalData.userData).filter( user => user.socketID === socketID)[0];
    }
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
