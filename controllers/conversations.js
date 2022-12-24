const { request, response } = require("express");
const Conversation = require('../models/conversation')

module.exports={
    postConversation: async (req = request, res = response) => {

        const { senderId, receiverId } = req.body;

        try {
            
            const newConversation = new Conversation({ members: [senderId, receiverId]})
            const savedConversation = await newConversation.save();

            const conversation = await Conversation.findById(savedConversation.id)
                .populate('members','nombre img')

            return res.json({
                ok:true,
                conversation
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Ocurrio un error hable con el administrador'
            })
        }

    },
    putConversation: async (req = request, res = response) => {

        const { id } = req.params;
        const { senderId } = req.body

        try {
            
            const conversation = await Conversation.findByIdAndUpdate(id, { new_messages: false })
            await conversation.save();

            const conversations = await Conversation.find({
                members:{ $in: senderId }
            })
            .populate('members','nombre img')

            return res.json({
                ok:true,
                conversations
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Ocurrio un error hable con el administrador'
            })
        }

    },
    getConversarion: async (req = request, res = response) => {
        const { id } = req.params;
        try {
            
            const conversations = await Conversation.find({
                members:{ $in: id }
            })
            .populate('members','nombre img')

            return res.json({
                ok:true,
                conversations
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