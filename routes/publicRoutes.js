const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/', (req, res) => {
  res.send('Hello World!');
});
router.post("/register",userController.registerUser);

module.exports = router;