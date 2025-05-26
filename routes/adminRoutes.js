const express = require('express');
const router = express.Router();
//controladores para endpoints
const userController = require('../controllers/userController');
const employeeController = require('../controllers/employeeController');
const inventoryController = require('../controllers/inventoryController');
const groupController = require('../controllers/groupController');
const permissionController = require('../controllers/permissionController');
const proyectController = require("../controllers/proyectController");
const usersGroupController = require("../controllers/usersGroupController");
const accountController = require("../controllers/accountController");
const portfolioController = require("../controllers/portfolioController");
const motionController = require("../controllers/motionController");
const taskController = require("../controllers/taskController");
const ticketController = require("../controllers/ticketController");
const hiringController = require("../controllers/hiringController");
const AssignmentController = require("../controllers/assignmentPPEController");
const apiqueController = require("../controllers/apiqueController");

const User = require("../models/user");
const Account = require("../models/account");
const Inventory = require("../models/inventory");
const Motion = require("../models/motion");



//validacion
const validate = require("../middleware/validationScheme");

router.get("/dashboard", async (req,res) => {
  try {
    const users = await User.findAll();
    const account  = await Account.findAll();
    const inventario = await Inventory.findAll();
    const motion = await Motion.findAll();
    const data = {
      users: users,
      accounts : account,
      inventarios : inventario,
      movimientos: motion
    };
    res.json(data); 
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});


//rutas para la creacion de apiques
router.get("/apique",apiqueController.getApiques);
router.post("/apique",apiqueController.createApique);
router.delete("/apique/:id",apiqueController.deleteApique);
router.put("/apique/:id",apiqueController.updateApique);

//rutas para la tabla de usuarios desde el administrador
router.post("/users", validate("users"), userController.createUser);
router.get("/users", userController.getUsers);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", userController.updateUser);
router.put("/users/:id/active", userController.activateUser);
router.put("/users/:id/inactive", userController.inactivateUser);
router.get("/usersCampo",userController.getCampoUsers);

router.get("/employee", employeeController.getEmployee);
router.post("/employee", validate("users"), employeeController.createEmployee);
 

//functions for hiring 
router.get("/hiring",hiringController.getHiring);
router.post("/hiring",validate("hiring"),hiringController.createHiring);
router.put("/hiring/:id",validate("hiring"),hiringController.updateHiring);
router.delete("/hiring/:id",hiringController.deleteHiring);


//funciont in task in the group or mygroup
router.get("/task", taskController.getTask);
router.post("/task",validate("task"),taskController.createTask);
router.put("/task/:id", validate("task"),taskController.updateTask);
router.delete("/task/:id", taskController.deleteTask);
router.put("/task/:id/active", taskController.activeTask);  
router.put("/task/:id/inactive", taskController.inactiveTask);

//function is the ticket it
router.post("/ticket",validate("ticket"),ticketController.createTicket);
router.delete("/ticket/:id",ticketController.deleteTicket);
router.put("/ticket/:id",validate("ticket"),ticketController.updateTicket);
router.get("/ticket",ticketController.getTicket);

//funcionalidades para el inventario por parte del administrador
router.post("/inventory", validate("inventory"), inventoryController.createInventory);
router.put("/inventory/:id", validate("inventory"), inventoryController.updateInventory);
router.get("/inventory", inventoryController.getInventory);
router.delete("/inventory/:id", inventoryController.deleteInventory);
router.put("/inventory/:id/active", inventoryController.activeInventory);
router.put("/inventory/:id/inactive", inventoryController.inactiveInventory);


//funcionalidades para los grupos de trabajo
router.get("/groups", groupController.getGroups);
router.post("/groups", validate("group"), groupController.createGroup);
router.put("/groups/:id", validate("group"), groupController.updateGroup);
router.delete("/groups/:id", groupController.deleteGroup);
router.put("/groups/:id/active", groupController.activateGroup);
router.put("/groups/:id/inactive", groupController.inactivateGroup);
router.get("/groupNotProyect", groupController.getGroupNotProyect);


//funcionalidades para los usuarios de un grupo
router.get("/userGroup/:id", usersGroupController.getUsersGroup);
router.delete("/userGroup/:id", usersGroupController.deleteUsersGroup);
router.get("/userNotGroup", usersGroupController.getUsersNotGroup);


//funcionalidades para los proyectos
router.get("/proyects", proyectController.getProyect);
router.post("/proyects", validate("proyect"), proyectController.createProyect);
router.put("/proyects/:id", validate("proyect"), proyectController.updateProyect);
router.delete("/proyects/:id", proyectController.deleteProyect);
router.put("/proyects/:id/active", proyectController.activeProyect);
router.put("/proyects/:id/inactive", proyectController.inactiveProyect);
router.get("/groupProyect/:groupId", proyectController.getGroupProyect);
router.put("/deleteGroupProyect/:groupId", proyectController.deleteGroupProyect);


//funcionalidades para los permisos
router.get("/permissions", permissionController.getPermissions);
router.post("/permissions", validate("permission"), permissionController.createPermission);
router.put("/permissions/:id", validate("permission"), permissionController.updatePermission);
router.delete("/permissions/:id", permissionController.deletePermission);
router.put("/permissions/:id/active", permissionController.activePermission);
router.put("/permissions/:id/inactive", permissionController.inactivePermission);


//funcionalidades de las cuentas y movimientos en general las finanzas
router.post("/accounts", validate("account"), accountController.createAccount);
router.get("/accounts", accountController.getAccounts);
router.delete("/accounts/:id", accountController.deleteAccount);
router.put("/accounts/:id", validate("account"), accountController.updateAccount);
router.put("/accounts/:id/active", accountController.activeAccount);
router.put("/accounts/:id/inactive", accountController.inactiveAccount);


//funcionalidades para los movimientos financieros de las cuentas
router.post("/motions", validate("motions"), motionController.createMotion);
router.put("/motions/:id", validate("motions"), motionController.updateMotion);
router.delete("/motions/:id", motionController.deleteMotion);
router.get("/motions", motionController.getMotions);
router.put("/motions/:id/active", motionController.activeMotion);
router.put("/motions/:id/inactive", motionController.inactiveMotion);


//fuincionalidaes para el portafolio
router.get("/portfolio", portfolioController.getPortfolio);
router.post("/portfolio", portfolioController.createPortfolio);
router.put("/portfolio/:id",portfolioController.updatePortfolio);
router.delete("/portfolio/:id", portfolioController.deletePortfolio);
router.put("/portfolio/:id/active", portfolioController.activePortfolio);
router.put("/portfolio/:id/inactive", portfolioController.inactivePortfolio);

//routes for ppe assignment personal
router.get("/assignment",AssignmentController.getAssignment);
router.post("/assignment",validate("assignment"),AssignmentController.createAssignment);
router.put("/assignment/:id",validate("assignment"),AssignmentController.updateAssignment);
router.delete("/assignment/:id",AssignmentController.deleteAssignment);

module.exports = router;