const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.post("/emailRegistro",userController.validarUser);
router.get("/register/:token",userController.registerUser);
router.post("/login",userController.login);

module.exports = router;