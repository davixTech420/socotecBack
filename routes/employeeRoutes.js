const express = require('express');
const router = express.Router();
const validate = require("../middleware/validationScheme");
const permissionController = require("../controllers/permissionController");
const usersGroupController = require("../controllers/usersGroupController");


router.get("/myPermissions/:id", permissionController.getMyPermissions);

router.get("/myGroup/:id",usersGroupController.getUsersGroup);

router.get("/permissionsByGroup/:id",permissionController.getPermissionsByGroup);


module.exports = router;