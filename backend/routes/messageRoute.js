const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {sendMessage, allMessages} = require('../controllers/messageController');

const router = express.Router();

//route for sending msg
router.route('/').post(protect,sendMessage);

//route for getting all chat for particular chatId
router.route('/:chatId').get(protect,allMessages);



module.exports=router;