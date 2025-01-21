const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');

//rutas para la tabla de usuarios desde el administrado
router.get("/users",userController.getUsers);

//funcionalidades para el inventario por parte del administrador
router.post("/inventory",inventoryController.createInventory);
router.get("/inventory",inventoryController.getInventory);
router.delete("/inventory/:id",inventoryController.deleteInventory);
router.put("/inventory/:id/active",inventoryController.activeInventory);
router.put("/inventory/:id/inactive",inventoryController.inactiveInventory);


module.exports = router;