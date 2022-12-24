const { Router } = require('express');
const { check } = require('express-validator');
const { getUser, postUser, putUser, deleteUser } = require('../controllers/users');
const { validarCampos, validarJWT } = require('../middlewares')
const { emailExiste, existeUsuarioId } = require('../helpers/dbValidator')

const router = Router();

router.get('/', getUser)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y de mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos //Captura todos los errores y los muestra
], postUser)

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], putUser)

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], deleteUser)

module.exports = router;