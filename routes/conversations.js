const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares')
// const { emailExiste, existeUsuarioId } = require('../helpers/dbValidator');
const { getConversarion, postConversation, putConversation } = require('../controllers/conversations');

const router = Router();

router.get('/:id',[
    check('id').isMongoId(),
    validarCampos
], getConversarion)

router.post('/', [
    check('senderId').isMongoId(),
    check('receiverId').isMongoId(),
    validarCampos //Captura todos los errores y los muestra
], postConversation)

router.put('/:id', [
    check('id').isMongoId(),
    check('senderId').isMongoId(),
    validarCampos //Captura todos los errores y los muestra
], putConversation)


module.exports = router;