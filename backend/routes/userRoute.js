const express = require('express')
const { registerUser,authUser, allusers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

//route to create a user
router.route('/').post(registerUser);

//route to login
router.post('/login',authUser);

//route to search users
router.route('/').get(protect,allusers);


module.exports = router;