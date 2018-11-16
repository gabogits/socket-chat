const crearMensaje = (nombre, mensaje, sala) => {
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime(),
        sala
    }
}

module.exports = {
    crearMensaje
}