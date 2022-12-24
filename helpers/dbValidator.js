//@ts-check
const Usuario = require('../models/usuario');

//Validar correo si existe
const emailExiste = async( correo = '' )=>{
    const existe = await Usuario.findOne({ correo })
    if( existe ) throw new Error (`El correo ${ correo } ya esta registrado`) 
}

//Validar usuario si no existe
const existeUsuarioId = async( id )=>{
    const existe = await Usuario.findById( id )
    if( !existe ) throw new Error (`No existe el usuario con id : ${ id }.`) 
} 


module.exports = {
    emailExiste,
    existeUsuarioId,
}