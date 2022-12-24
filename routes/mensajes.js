const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares')
// const { emailExiste, existeUsuarioId } = require('../helpers/dbValidator');
const { getMensajes, postMensaje } = require('../controllers/mensajes');

const router = Router();

//Obtener mensajes de una conversacion id=conversationId
router.get('/:id',[
    check('id').isMongoId(),
    validarCampos
], getMensajes)

//Guardar un mensaje
router.post('/', [
    check('fecha').isDate(),
    check('mensaje').not().isEmpty(),
    check('sender','No es un id valido').isMongoId(),
    check('conversation_id','No es un id valido').isMongoId(),
    validarCampos 
], postMensaje)


module.exports = router;