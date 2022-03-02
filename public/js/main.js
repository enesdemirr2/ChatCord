const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL --> URL'den kullanıcı adı ve od al
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

// Join chatroom --> Sohbete katıl
socket.emit('joinRoom', { username, room});

// Get room and users --> Oda ve kullanıcı al
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server --> Sunucudan mesaj
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down --> Chat roomda yeni mesajlar geldikçe aşağı kaydır
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit --> Mesaj gönder
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text --> Mesaj metnini al
    const msg = e.target.elements.msg.value;

    // Emit message to server --> Sunucuya mesaj gönder
    socket.emit('chatMessage', msg);

    // CLear inputs --> Girişleri temizle
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM --> DOM'a çıkış mesajı
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
     ${message.text} 
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    
}

// Add room name to DOM --> DOM'a oda ado ekle
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM --> DOM'a kullanıcı ekle
function outputUsers(users) {
    userList.innerHTML = `
       ${users.map( user => `<li> ${user.username} </li>`).join('')}
    
    `;

    
}