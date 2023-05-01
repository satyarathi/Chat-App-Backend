const express = require('express')
const { registerUser } = require("../controllers/userController");

const router = express.Router();

//route to create a user
router.route('/').post(registerUser);


module.exports = router;