const { request, response } = require("express");
const Message = require('../models/mensaje')

module.exports={
    postMensaje: async (req = request, res = response) => {

        // const { conversation_id, mensaje, sender, fecha } = req.body;

        try {
            
            const newMensaje = new Message(req.body)
            const savedMensaje = await newMensaje.save();

            return res.json({
                ok:true,
                mensaje: savedMensaje
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Ocurrio un error hable con el administrador'
            })
        }

    },
    getMensajes: async (req = request, res = response) => {
        const { id } = req.params; //Conversation ID
        try {
            
            const mensajes = await Message.find({ conversation_id:id })
                .populate('sender','nombre img')
            return res.json({
                ok:true,
                mensajes
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Ocurrio un error hable con el administrador'
            })
        }
    }
}