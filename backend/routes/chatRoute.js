const express = require('express')
const { protect } = require("../middleware/authMiddleware");
const {
    accessChat,

  } = require("../controllers/chatController");

const router = express.Router();

//route to access chat
router.route("/").post(protect, accessChat);



module.exports = router;