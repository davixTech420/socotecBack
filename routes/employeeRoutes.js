const express = require('express');
const router = express.Router();
const validate = require("../middleware/validationScheme");

const employeeController = require("../controllers/employeeController");
const permissionController = require("../controllers/permissionController");






router.get("/myPermissions/:id", permissionController.getMyPermissions);


module.exports = router;