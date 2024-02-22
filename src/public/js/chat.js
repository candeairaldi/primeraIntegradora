const socket = io();
let user;
let chatBox = document.querySelector('#box');
let sendButton = document.querySelector('#button');

Swal.fire({
    title: '¿Cómo te llamas?',
    input: 'text',
    text: 'Ingresá tu usuario',
    inputValidator: (value) => {
        return !value && '¡Escribe tu usuario!';
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    socket.emit('usuario-conectado', user);
});

chatBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user, message: chatBox.value });
            chatBox.value = '';
        }
    }
});

sendButton.addEventListener('click', () => {
    if (chatBox.value.trim().length > 0) {
        socket.emit('message', { user, message: chatBox.value });
        chatBox.value = '';
    }
});

socket.on('user-connected', (user) => {
    Swal.fire({
        text: `${user} se ha conectado`,
        icon: 'success',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 5000,
    })
});

socket.on('usuario-desconectado', (user) => {
    Swal.fire({
        text: `${user} se ha desconectado`,
        icon: 'warning',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 5000,
    })
});

socket.on('registros', (data) => {
    let log = document.querySelector('#registros');
    let messages = '';
    data.forEach((message) => {
        messages = messages + `${message.user}: ${message.message}</br>`;
    });
    log.innerHTML = messages;
});