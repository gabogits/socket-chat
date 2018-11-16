var socket = io();

var params = new URLSearchParams(window.location.search);

var people = [];

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);

        renderizarUsuarios(resp);
    });







});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    //no confundir el socket.emit('crearMensaje', que enviamos, no quiere decir que nosotros vamos a escuchar el propio mensaje que emitimos
    //si no el de otros
    if (mensaje.sala == sala) {
        //console.log('Servidor:', mensaje);
        renderizarMensajes(mensaje, false); //en esete listen, estamos escuchando los mensajes que han pasado por el servidor
        scrollBottom();
    }
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {
    console.log(personas);
    renderizarUsuarios(personas);
    people = personas;

});

// Mensajes privados
socket.on('mensajePrivado', function(data) {


    renderizarMensajePrivado(data);
});
/*
socket.on('entrarChatPrivado', function(mensaje) {

    

});

*/