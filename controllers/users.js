//@ts-check

const { request, response } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");


module.exports={
    getUser: async (req = request, res = response) => {
        const { limite = 5, desde = 0 } = req.query;

        const [ total, usuarios ] = await Promise.all([
            Usuario.countDocuments({ estado:true }),   
            Usuario.find({ estado:true })
                .skip( Number(desde) )
                .limit( Number(limite) )
        ])
  
        res.json({ total, usuarios })
    },
    postUser: async (req = request, res = response) => {
        
        const { password } = req.body

        const usuario = new Usuario(req.body);

        //Encriptar el password
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );
        usuario.img = `https://i.pravatar.cc/150?u=${usuario.id}`
        
        //Guardar
        const newUsuario =  await usuario.save()

        const token = await generarJWT(newUsuario.id)
        
        res.json({ msg:"post API", usuario: newUsuario, token })
    },
    putUser: async (req = request, res = response) => {
        const { id } = req.params
        const { _id, password, google, correo, ...resto } = req.body;

        if ( password ) {
            //Encriptar el password
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync( password, salt );
        }

        const usuario = await Usuario.findByIdAndUpdate( id, resto ); 

        res.json({ msg:"put API", params:req.params.id, usuario })
    },

    deleteUser:async(req = request, res = response) => {
        const { id } = req.params

        //Borrado fisico de la base de datos
        //const usuario = await Usuario.findByIdAndDelete(id)

        const usuario = await Usuario.findByIdAndUpdate( id, { estado:false })
        res.json({ usuario })
    }
}