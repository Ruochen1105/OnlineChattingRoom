require('dotenv').config()
const express = require("express");
const path = require('path');
const passport = require('passport');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.online=[]

const api = require('./api');
const auth = require('./auth');

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'build')));

app.use('/api',passport.authenticate('jwt'), api);
app.use('/auth', auth);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'))
})


io.on('connect', function (sock) {
    console.log(sock.id, ' has connected');

    sock.on('login', function(username) {
        sock.username = username[0];
        io.online.push(sock.username);
        sock.join('logged');
        sock.emit('update');
        io.to('logged').emit('user', [io.online])
    })

    sock.on('post', function () {
        io.emit('update');
    });
});

server.listen(process.env.PORT || 3000);