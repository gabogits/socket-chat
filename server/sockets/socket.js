const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');
const usuarios = new Usuarios();

io.on('connection', (client) => { //el objeto  client viene con muchos metodos y propiedades, entre ellos el ID

    client.on('entrarChat', (data, callback) => { //este es lo que escucha el server cuando un usuario se conecta 

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: "El nombre/sala es necesario"
            })
        }

        client.join(data.sala); //con esto se une al usurio a una sala

        usuarios.agregarPersona(client.id, data.nombre, data.sala);


        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        // con la anterior instruccion  client.broadcast.emit('listaPersona', usuarios.getPersonas());
        //se notifica a todos los usuarios cuando alguien e conectó, independientemente de la sala en la que este


        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`));
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        //como se va estar enviando mensajes, todo el tiempo, se creo el metodo crearMensaje, que incluye un objeto, con el nombre quien envia el mensaje, el mensaje y la fecha en que se hizo

        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    })

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    });
});