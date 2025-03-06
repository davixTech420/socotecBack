const express = require('express');
const router = express.Router();
const validate = require("../middleware/validationScheme");

const employeeController = require("../controllers/employeeController");
const permissionController = require("../controllers/permissionController");
const usersGroupController = require("../controllers/usersGroupController");






router.get("/myPermissions/:id", permissionController.getMyPermissions);

router.get("/myGroup/:id",usersGroupController.getUsersGroup);


module.exports = router;