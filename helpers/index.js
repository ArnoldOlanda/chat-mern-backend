const dbValidator  = require('./dbValidator');
const generarJWT   = require('./generarJWT');
const googleVerify = require('./googleVerify');
const subirArchivo = require('./subirArchivo');


module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}