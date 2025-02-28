const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const portfolioController = require('../controllers/portfolioController');
const validate = require("../middleware/validationScheme");
//esta ruta es para enviar el email al crear la cuenta
router.post("/emailRegistro",validate("users"),userController.validarUser);
//esta es la ruta que recibe cunado se oprime el email
router.get("/register/:token",userController.registerUser);
router.post("/login",validate("login"),userController.login);
//esta es la ruta para el email de recuperar la contraseña
router.post("/emailPassword",validate("emailPass"),userController.emailPassword);
//esta es la ruta para enviar  el fromulario de restablecimiento de contraseña
router.post("/forgotPassword",validate("forgotPassword"),userController.forgotPassword);

router.post("/validarToken",userController.validarToken);

//ruta para mostar portafolio
router.get("/portfolio",portfolioController.getPortfolioActive);

module.exports = router;