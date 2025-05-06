const express = require('express');
const router = express.Router();

const permissionController = require("../controllers/permissionController");
const usersGroupController = require("../controllers/usersGroupController");
const taskController = require("../controllers/taskController");
const ticketController = require("../controllers/ticketController");
const hiringController = require("../controllers/hiringController");
const AssignmentController = require("../controllers/assignmentPPEController");
const InventoryController = require("../controllers/inventoryController");
const userController = require("../controllers/userController");
const validate = require('../middleware/validationScheme');



router.get("/dashboard",async (req,res) => {

});


router.get("/myGroup/:id",usersGroupController.getUsersGroup);

//rutas para los permisos de empleados
router.get("/myPermissions/:id", permissionController.getMyPermissions);
router.get("/permissionsByGroup/:id",permissionController.getPermissionsByGroup);
router.post("/permissions", validate("permission"), permissionController.createPermission);
router.put("/permissions/:id", validate("permission"), permissionController.updatePermission);
router.delete("/permissions/:id", permissionController.deletePermission);


//rutas para asignar tareas
router.post("/task",validate("task"),taskController.createTask);
router.get("/taskMyGroup/:id",taskController.getTaskMyGroup);


//routes for tickets employess
router.get("/myTickets/:id",ticketController.getMyTickets);
router.post("/ticket",validate("ticket"),ticketController.createTicket);
router.put("/ticket/:id",validate("ticket"),ticketController.updateTicket);
router.delete("/ticket/:id",ticketController.deleteTicket);


//routes for hiring or candidate
router.get("/hiring",hiringController.getHiring);
router.post("/hiring",hiringController.createHiring);
router.put("/hiring/:id",hiringController.updateHiring);
router.delete("/hiring/:id",hiringController.deleteHiring);


//routes for ppe assignment
router.get("/assignment",AssignmentController.getAssignment);
router.post("/assignment",validate("assignment"),AssignmentController.createAssignment);
router.put("/assignment/:id",validate("assignment"),AssignmentController.updateAssignment);
router.delete("/assignment/:id",AssignmentController.deleteAssignment);
router.get("/myAssignment/:id",AssignmentController.getMyAssignment);


//router for inventory
router.get("/inventory",InventoryController.getActiveInventory);
router.get("/inventoryAll",InventoryController.getInventory);
router.post("/inventory", validate("inventory"), InventoryController.createInventory);
router.put("/inventory/:id", validate("inventory"), InventoryController.updateInventory);
router.delete("/inventory/:id", InventoryController.deleteInventory);
router.put("/inventory/:id/active", InventoryController.activeInventory);
router.put("/inventory/:id/inactive", InventoryController.inactiveInventory);


//routes for users
router.get("/activeUsers",userController.getActiveUsers);
router.get("/usersCampo",userController.getCampoUsers);


module.exports = router;