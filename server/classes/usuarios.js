class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala }
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0]; //para regresar una persona un id, especifico, que solo regrese un item, esta es la condicion persona.id === id
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        // return this.personas;
        let personaEnSala = this.personas.filter(persona => persona.sala === sala);
        return personaEnSala;

    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        //el arreglo personas se le vuelven a asignar valores, excluyendo el valor o (la persona), a la que se refiere el id
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;


    }
}

module.exports = {
    Usuarios
}