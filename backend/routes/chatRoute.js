const express = require('express')
const { protect } = require("../middleware/authMiddleware");
const {
    accessChat,
    fetchChats,
    createGroupChat
  } = require("../controllers/chatController");

const router = express.Router();

//route to access chat
router.route("/").post(protect, accessChat);

//route to fetch chat
router.route("/").get(protect, fetchChats);

//route to create group
 router.route("/group").post(protect, createGroupChat);


module.exports = router;