"user strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routesConfig = require('./routes/index');
var open = require("open")
, server = require('http').createServer(app)
, io = require("socket.io")(server)
,model = require('./models/index');
var jwt    = require('jsonwebtoken');
var appSeckertKey = require('./config/appConfig').secret;

const PORT = process.env.port || 7000;
const URL = '127.0.0.1';
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname+'/public/images'));
app.use(bodyParser.urlencoded({ extend: false}));
app.use(bodyParser());
app.set('view engine', 'ejs');




routesConfig(app);

io.use((socket, next) => {
    let token = socket.handshake.query.token;
    jwt.verify(token, appSeckertKey, (err, decoded) => {
        if (err) {
            console.log(err);
            return next(new Error('authentication error'));
        }

        socket.decodedtoken = decoded;
        return next();
    });
});
io.of('/chat').on('connection', function(socket) {
    console.log('a user connected');
    console.log(socket.id);

    jwt.verify(socket.handshake.query.token, appSeckertKey, (err, decoded) => {
        let decodedToken = decoded;

        model.users.update({'isActive': 1, 'socketID': socket.id}, {where: {'id': decodedToken.user_id}})
            .then(user => {
                console.log('user is online');
                socket.broadcast.emit('online User', decodedToken.user_id);
            });

        socket.on('disconnect', function (data) {
            model.users.update({'isActive': 0, 'socketID': null}, {where: {'id': decodedToken.user_id}}).then(user => {
                console.log('user is offline');
                socket.broadcast.emit('disconnected User', decodedToken.user_id);
            });
            console.log('user disconnected');
            socket.emit('disconnected');
        });

        socket.on('message', function (msg) {
            console.log('new message');
            model.users.findOne({where: {'id': decodedToken.user_id}}).then(user => {
                socket.to(msg.conversation_id).emit('new message',
                    {
                        message_body: msg.message_body, user: {avatarPath: user.avatarPath, first_name: user.first_name},
                        created_at: msg.created_at
                });
                socket.emit(msg.conversation_id,message);
            });

            model.users.findOne({where: {'id': msg.receiver_id}}).then(user => {
                socket.to(user.socketID).emit('notify', {
                    message_body: msg.message_body, sender_id: decodedToken.user_id,
                    created_at: msg.created_at
                });
            });
        });


        socket.on('join room', function (roomname) {
            console.log('joined room ' + roomname);
            socket.join(roomname);
        });


    });
});

server.listen(PORT, function (error) {
    if(error)
        console.log(error);
    console.log(`The Server Is Running ${URL}:${PORT}`);
    open(`http://${URL}:${PORT}`, "chrome");
});