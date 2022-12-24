//@ts-check
const { Schema, model } = require('mongoose')

const ConversationSchema = new Schema({
    members:[{
        type:Schema.Types.ObjectId,
        ref:'Usuario'
    }],
    new_messages:{
        type:Boolean,
        default:false
    }
})

ConversationSchema.methods.toJSON = function () {
    const { _id, ...conversation } = this.toObject();
    conversation.uid = _id;
    return conversation;
}

module.exports = model('Conversation', ConversationSchema)