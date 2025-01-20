const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');

//rutas para la tabla de usuarios desde el administrado
router.get("/users",userController.getUsers);

router.post("/inventory",inventoryController.createInventory);

module.exports = router;