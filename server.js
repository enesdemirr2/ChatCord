const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when client connects -- Sunucu bağlandığında çalıştır
io.on('connection', socket => {

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast.emit(
      'message', 
       formatMessage(botName, 'A user has joined the chat')
    );

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName,  'A user has left the chat'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
