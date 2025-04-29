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
router.get("/myPermissions/:id", permissionController.getMyPermissions);

router.get("/myGroup/:id",usersGroupController.getUsersGroup);

router.get("/permissionsByGroup/:id",permissionController.getPermissionsByGroup);

//rutas para asignar tareas
router.post("/task",validate("task"),taskController.createTask);
router.get("/taskMyGroup/:id",taskController.getTaskMyGroup);

//routes for tickets employess
router.get("/myTickets/:id",ticketController.getMyTickets);

//routes for tickets
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

//routes for users
router.get("/activeUsers",userController.getActiveUsers);
router.get("/usersCampo",userController.getCampoUsers);


module.exports = router;