const chatForm = document.getElementById('chat-form')
const socket = io();

socket.on('message', message => {
    console.log(message);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    console.log(msg);

});