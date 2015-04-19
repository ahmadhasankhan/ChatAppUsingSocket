var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5001;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var usernames = {};
var numUsers = 0;

var clients = {};

var socketsOfClients = {};

io.sockets.on('connection', function (socket) {
    console.log(  socket.id + ' Connected');

    // when the client emits 'add user', this listens and executes
    socket.on('set username', function (userName) {

        // we store the username in the socket session for this client
        socket.username = userName;

        // add the client's username to the global list
        usernames[userName] = userName;
        ++numUsers;

        addedUser = true;
        userJoined
        socket.emit('login', {
            numUsers: numUsers
        });

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });

    });


    socket.on('disconnect', function () {
        console.log(  socket.id + ' Disconnected');
        var uName = socketsOfClients[socket.id];
        delete socketsOfClients[socket.id];
        delete clients[uName];

        // relay this message to all the clients

        userLeft(uName);
    })
});

function userJoined(uName) {
    Object.keys(socketsOfClients).forEach(function (sId) {
        io.emit('userJoined', { "userName": uName });
    });
    console.log(  socket.username + ' added');
}

function userLeft(uName) {
    io.sockets.emit('userLeft', { "userName": uName });
}

function userNameAvailable(sId, uName) {
    setTimeout(function () {

        //console.log('Sending welcome msg to ' + uName + ' at ' + sId);
        //io.sockets.sockets[sId].emit('welcome', { "userName": uName, "currentUsers": JSON.stringify(Object.keys(clients)) });

    }, 500);
}

function userNameAlreadyInUse(sId, uName) {
    setTimeout(function () {
        io.sockets.sockets[sId].emit('error', { "userNameInUse": true });
    }, 500);
}


http.listen(port, function () {
    console.log('Server listening at port %d', port);
});



