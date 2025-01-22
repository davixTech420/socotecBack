const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');

//rutas para la tabla de usuarios desde el administrador
router.get("/users",userController.getUsers);
router.delete("/users/:id",userController.deleteUser);
router.put("/users/:id",userController.updateUser);
router.put("/users/:id/active",userController.activateUser);
router.put("/users/:id/inactive",userController.inactivateUser);
router.put("/users/:id/role",userController.changeRole);


//funcionalidades para el inventario por parte del administrador
router.post("/inventory",inventoryController.createInventory);
router.get("/inventory",inventoryController.getInventory);
router.delete("/inventory/:id",inventoryController.deleteInventory);
router.put("/inventory/:id/active",inventoryController.activeInventory);
router.put("/inventory/:id/inactive",inventoryController.inactiveInventory);





module.exports = router;