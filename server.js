const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const { 
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers

} = require('./utils/users.js');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder --> Statik klasör ayarla
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when client connects --> Sunucu bağlandığında çalıştır
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room}) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user -->  Mevcut kullanıcıya hoşgeldiniz
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects --> Bir kullanıcı bağlandığında yayınla
    socket.broadcast
      .to(user.room)
      .emit(
        'message', 
        formatMessage(botName, `${user.username} has joined the chat`)
    );

    // Send users and room info --> Kullanıcıları ve oda bilgilerini gönder
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
});

    // Listen for chatMessage --> Sohbeti okuma veya dinleme
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
});

     // Runs when client disconnects --> İstemci bağlantısı kesildiğinde çalışır
     socket.on('disconnect', () => {
        
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit(
                'message', 
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info --> Kullanıcıları ve oda bilgilerini gönder
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
