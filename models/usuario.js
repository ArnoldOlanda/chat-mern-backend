//@ts-check
const { Schema,model } = require('mongoose')

const UsuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[ true,'El nombre es obligatorio' ]
    },
    correo:{
        type:String,
        required:[ true,'El correo es obligatorio' ],
        unique:true
    },
    password:{
        type:String,
        required:[ true,'El password es obligatorio' ],
    },
    img:{ 
        type:String 
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
})

UsuarioSchema.methods.toJSON = function () {
    const { __v, password,_id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario' , UsuarioSchema )