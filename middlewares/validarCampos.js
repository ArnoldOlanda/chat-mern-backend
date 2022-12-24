//@ts-check
const { response } = require("express");
const { request } = require("express");
const { validationResult } = require("express-validator");

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const validarCampos = ( req, res, next ) => {
    const errors = validationResult( req );

    if(!errors.isEmpty()) 
        return res.status(400).json({
            errors:errors.mapped()
        }); 

    next();
}

module.exports ={
    validarCampos
}