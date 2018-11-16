// Funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');




// refrencias de jQuery
var divUsuarios = $("#divUsuarios");
var formEnviar = $("#formEnviar");
var txtMensaje = $("#txtMensaje");
var divChatbox = $("#divChatbox")
var searchContact = $("#searchContact")
var divMensajePrivado = $("#divMensajePrivado")


function renderizarUsuarios(personas) { //[{}, {},{}]

    var html = '';
    html += '<li>';
    html += '       <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';


    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" data-name="' + nombre + '" href="chat.html?nombre=' + nombre + '&sala=' + personas[i].id + '" target="_blank"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}


function renderizarMensajes(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';


    }

    if (yo) {

        html += '<li class="animate fadeIn reverse">';
        html += '    <div class="chat-content">';
        html += '       <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-info">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {
        html += '<li class="animate fadeIn">';

        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '    <h5>' + mensaje.nombre + '</h5>';
        html += '    <div class="box  bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '    </li>';
    }

    divChatbox.append(html);
}


function renderizarMensajePrivado(data) {
    var html = '<div class="box bg-light-info"><a target="_blank" href="chat.html?nombre=' + nombre + '&sala=' + data.sala + '">' + data.mensaje + '</a></div>';


    divMensajePrivado.append(html);

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// listeners

divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');
    if (id) {
        console.log(id)
    }


    var data = {
        nombre: nombre,
        mensaje: `${nombre} quiere hablar contigo`,
        sala: id,
        id: id
    }

    socket.emit('mensajePrivado', data);


})


formEnviar.on('submit', function(e) {
    //en esta funcion nosotros realizamos el mensaje, cunado lo emitimos mandamos la data y hay un callback con 
    //con nuestro mensaje de regreso, que ejecuta la funcion que lo rendera en el front, mandando como argumento la bandera de
    //que es un mensaje nuestro

    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }





    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val(),
        sala: sala
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true)
        scrollBottom();
    });











})

searchContact.on('keyup', function(e) {
    const query = $(this).val();
    var filtered = people.filter(r => r.nombre.toLowerCase().includes(query));
    renderizarUsuarios(filtered)

});

/*

  socket.emit('mensajePrivado', {
            nombre: nombre,
            mensaje: txtMensaje.val(),
            para: destino
        }, function(mensaje) {
            txtMensaje.val('').focus();
            renderizarMensajes(mensaje, true)
            scrollBottom();
        });*/