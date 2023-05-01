const express = require('express')
const { registerUser,authUser } = require("../controllers/userController");

const router = express.Router();

//route to create a user
router.route('/').post(registerUser);

//route to login
router.post('/login',authUser);

module.exports = router;