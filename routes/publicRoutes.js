const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//esta ruta es para enviar el email al crear la cuenta
router.post("/emailRegistro",userController.validarUser);
//esta es la ruta que recibe cunado se oprime el email
router.get("/register/:token",userController.registerUser);
router.post("/login",userController.login);


//esta es la ruta para el email de recuperar la contraseña
router.post("/emailPassword",userController.emailPassword);
//esta es la ruta para enviar  el fromulario de restablecimiento de contraseña
router.post("/forgotPassword",userController.forgotPassword);

module.exports = router;