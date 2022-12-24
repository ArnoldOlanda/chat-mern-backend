class Mensaje{
    constructor(uid,nombre,mensaje, tipoMensaje, destinatario){
        this.uid          = uid;
        this.nombre       = nombre;
        this.mensaje      = mensaje;
        this.tipoMensaje  = tipoMensaje; //General o Privado
        this.destinatario = destinatario;
    }
}

class ChatMensajes {
    constructor(){
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10 () {
        const mensajes = this.mensajes.filter(mensaje => mensaje.tipoMensaje === 'General')
        //const mensajes = this.mensajes.filter(mensaje => mensaje.tipoMensaje === 'General').splice(0,20)
        return mensajes;
    }

    get usuariosArr(){
        return Object.values( this.usuarios )
    }

    enviarMensaje( uid, nombre, mensaje, tipoMensaje, destinatario ){
        this.mensajes.push(
            new Mensaje( uid, nombre, mensaje, tipoMensaje, destinatario )
        );
    }

    ultimos10Privados( uid, destinatario ){
        const mensajes = this.mensajes.filter( mensaje => 
            (mensaje.uid === uid && mensaje.destinatario === destinatario) ||
            (mensaje.uid === destinatario && mensaje.destinatario === uid)
        )

        return mensajes
    }

    conectarUsuario( usuario ){
        this.usuarios[usuario.id] = usuario
    }

    desconectarUsuario( id ) {
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes;