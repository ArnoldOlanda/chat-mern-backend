
const bcryptjs = require('bcryptjs');
const { response, request } = require('express');
const req = require('express/lib/request');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/googleVerify');
const Usuario = require('../models/usuario');


const login = async (req = request, res = response )  =>{
    
    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        
        if(!usuario) return res.status(400).json({
            msg:'Este usuario no esta registrado en la base de datos'
        })
        
        //Si el usuario esta activo
        if (!usuario.estado) return res.status(400).json({
            msg:'Este usuario no se encuentra activo en el sistema'
        })
        
        //Verificar el password
        const validaPassword = bcryptjs.compareSync( password,usuario.password );
        if(!validaPassword) return res.status(400).json({
            msg:'Password incorrecto'
        })
        // Generar el jwt
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async (req, res=response ) =>{
    const { id_token } = req.body

    try {

        const { name,email,picture } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo:email })

        if(!usuario){
            const data = {
                nombre:name,
                correo:email,
                password:':v',
                img:picture,
                google:true,
                rol:'USER_ROLE'
            }
            usuario = new Usuario(data)
            console.log(usuario);
            await usuario.save();
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg:'Usuario no activo'
            })
        }

        // Generar el jwt
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok:'false',
            msg:'No se pudo verificar el token'
        })
    }

} 

const renovarToken = async ( req, res ) => {
    const { autenthicatedUser, uid } = req;

    // Generar el jwt
    const token = await generarJWT( autenthicatedUser.id )

    res.json({
        usuario:autenthicatedUser,
        token,
        uid
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}