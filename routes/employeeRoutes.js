const express = require('express');
const router = express.Router();
const validate = require("../middleware/validationScheme");
const permissionController = require("../controllers/permissionController");
const usersGroupController = require("../controllers/usersGroupController");
const taskController = require("../controllers/taskController");
const ticketController = require("../controllers/ticketController");



router.get("/dashboard",async (req,res) => {

});
router.get("/myPermissions/:id", permissionController.getMyPermissions);

router.get("/myGroup/:id",usersGroupController.getUsersGroup);

router.get("/permissionsByGroup/:id",permissionController.getPermissionsByGroup);


//rutas para asignar tareas
router.post("/task",taskController.createTask);
router.get("/taskMyGroup/:id",taskController.getTaskMyGroup);

//routes for tickets employess

router.post("/ticket",ticketController.createTicket);
router.put("/ticket/:id",ticketController.updateTicket);
router.delete("/ticket/:id",ticketController.deleteTicket);

module.exports = router;