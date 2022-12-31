const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers/generarJWT');
const ChatMensajes = require('../models/chatMensajes');
const Mensaje = require('../models/mensaje')
const Conversation = require('../models/conversation')

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {

    //Authenticacion del usuario
    const token = socket.handshake.headers['x_token'];
    const usuario = await comprobarJWT(token);

    if (!usuario) return socket.disconnect();

    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr)

    //conectar a sala
    socket.join(usuario.id);

    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje', async (payload) => {

        const newMensaje = new Mensaje(payload)
        const saved = await newMensaje.save();

        const mensaje = await Mensaje.findById(saved.id).populate('sender', 'nombre img');
        await Conversation.findByIdAndUpdate(payload.conversation_id, { new_messages: true })

        const conversations = await Conversation.find({
            members: { $in: payload.currentReceiver }
        }).populate('members', 'nombre img')

        socket.to(payload.currentReceiver).emit('recibir-mensajes', { mensaje, conversations });
        // socket.emit('recibir-mensajes', { mensaje });

    })

    socket.on('obtener-mensajes', ({ uid, destinatario }) => {

        if (!uid && !destinatario) {

            socket.emit('recibir-mensajes-generales', chatMensajes.ultimos10);

        } else {

            const mensajesPrivados = chatMensajes.ultimos10Privados(usuario.id, destinatario);
            socket.emit('recibir-mensajes-privados', mensajesPrivados);

        }
    });

    socket.on('escribiendo', (receiver) => {
        socket.to(receiver).emit('escribiendo-mensaje', { nombre: usuario.nombre, id: usuario.id })
    })

    socket.on('nueva-conversacion', async ({ id, receiver }) => {
        console.log({ id, receiver })
        const conversation = await Conversation.findById(id).populate('members', 'nombre img')
        socket.to(receiver).emit('agregar-nueva-conversacion', conversation)
    })
}

module.exports = {
    socketController
}