//@ts-check
const { Schema, model } = require('mongoose')

const MensajeSchema = new Schema({
    fecha: {
        type: Date,
        required: true
    },
    mensaje: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    conversation_id:{
        type: Schema.Types.ObjectId,
        ref:'Conversation',
        required: true
    }
})

MensajeSchema.methods.toJSON = function () {
    const { _id, ...mensaje } = this.toObject();
    mensaje.uid = _id;
    return mensaje;
}

module.exports = model('Mensaje', MensajeSchema)