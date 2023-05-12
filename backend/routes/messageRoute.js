const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {sendMessage, allMessages, deleteMessage} = require('../controllers/messageController');

const router = express.Router();

//route for sending msg
router.route('/').post(protect,sendMessage);

//route for getting all chat for particular chatId
router.route('/:chatId').get(protect,allMessages);

//route for deleting msg
router.route('/:_id').delete(protect, deleteMessage)



module.exports=router;