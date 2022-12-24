

const validarCampos = require ('../middlewares/validarCampos');
const validarJWT    = require ('../middlewares/validarJWT');


module.exports = {
    ...validarCampos,
    ...validarJWT,
}

