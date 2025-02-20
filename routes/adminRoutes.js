const express = require('express');
const router = express.Router();
//controladores para endpoints
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const groupController = require('../controllers/groupController');
const permissionController = require('../controllers/permissionController');
const proyectController = require("../controllers/proyectController");
const usersGroupController = require("../controllers/usersGroupController");
const accountController = require("../controllers/accountController");
//modelos para endpoints en especifico
const User = require("../models/user");
const Permission  = require("../models/permission");
//validacion
const validate = require("../middleware/validationScheme");




router.get("/dashboard",(req,res)=>{
  res.send("admin");
});






//rutas para la tabla de usuarios desde el administrador
router.post("/users",validate("users"),userController.createUser);
router.get("/users",userController.getUsers);
router.delete("/users/:id",userController.deleteUser);
router.put("/users/:id",userController.updateUser);
router.put("/users/:id/active",userController.activateUser);
router.put("/users/:id/inactive",userController.inactivateUser);




//funcionalidades para el inventario por parte del administrador
router.post("/inventory",inventoryController.createInventory);
router.put("/inventory/:id",inventoryController.updateInventory);
router.get("/inventory",inventoryController.getInventory);
router.delete("/inventory/:id",inventoryController.deleteInventory);
router.put("/inventory/:id/active",inventoryController.activeInventory);
router.put("/inventory/:id/inactive",inventoryController.inactiveInventory);



//funcionalidades para los grupos de trabajo
router.get("/groups",groupController.getGroups);
router.post("/groups",groupController.createGroup);
router.put("/groups/:id",groupController.updateGroup);
router.delete("/groups/:id",groupController.deleteGroup);
router.put("/groups/:id/active",groupController.activateGroup);
router.put("/groups/:id/inactive",groupController.inactivateGroup);
router.get("/groupNotProyect",groupController.getGroupNotProyect);


//funcionalidades para los usuarios de un grupo
router.get("/userGroup/:id",usersGroupController.getUsersGroup);
router.delete("/userGroup/:id",usersGroupController.deleteUsersGroup)
router.get("/userNotGroup",usersGroupController.getUsersNotGroup);


//funcionalidades para los proyectos
router.get("/proyects",proyectController.getProyect);
router.post("/proyects",proyectController.createProyect);
router.put("/proyects/:id",proyectController.updateProyect);
router.delete("/proyects/:id",proyectController.deleteProyect);
router.put("/proyects/:id/active",proyectController.activeProyect); 
router.put("/proyects/:id/inactive",proyectController.inactiveProyect);



//funcionalidades para los permisos
router.get("/permissions",permissionController.getPermissions);
router.post("/permissions",permissionController.createPermission);
router.put("/permissions/:id",permissionController.updatePermission);
router.delete("/permissions/:id",permissionController.deletePermission);
router.put("/permissions/:id/active",permissionController.activePermission);
router.put("/permissions/:id/inactive",permissionController.inactivePermission);





//funcionalidades de las cuentas y movimientos en general las finanzas
router.post("/accounts",accountController.createAccount);
router.get("/accounts",accountController.getAccounts);
router.delete("/accounts/:id",accountController.deleteAccount);
router.put("/accounts/:id",accountController.updateAccount);



module.exports = router;