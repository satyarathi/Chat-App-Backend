const express = require('express')
const { protect } = require("../middleware/authMiddleware");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup
  } = require("../controllers/chatController");

const router = express.Router();

//route to access chat
router.route("/").post(protect, accessChat);

//route to fetch chat
router.route("/").get(protect, fetchChats);

//route to create group
 router.route("/group").post(protect, createGroupChat);

 //route to rename group
 router.route("/rename").put(protect, renameGroup);

// //route to add to group
 router.route("/groupadd").put(protect, addToGroup);


module.exports = router;