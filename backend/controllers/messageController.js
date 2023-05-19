const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const logger = require("../config/logger");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, image, chatId } = req.body;

  if (!chatId) {
    logger.error("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    image: image,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
    logger.info("Msg Send SuccessFully");
  } catch (error) {
    res.status(400);
    logger.error("Error in Sending msg");
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
    console.log(messages);
    logger.info("Messages Fetched Successfully");
  } catch (error) {
    res.status(400);
    logger.error("Error in fetching Messages");
    throw new Error(error.message);
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  console.log("id will be here", req.params._id);
  try {
    const message = await Message.findByIdAndDelete(req.params._id);

    console.log("single message", message);
    if (!deleteMessage) {
      return res.status(404).send({ message: "Message not found" });
    }
    res.json([]);
    logger.info("message deleted successfully");
  } catch (error) {
    res.status(400);
    logger.error("Error in deleting msg");
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages, deleteMessage };
