const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Message = require('../models/messageModel');

const CLIENT_ID = '1065069312436-1vcvm9rm7b7jkr3le7frkbr8l0lnn9ld.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04lt59AcwpcjjCgYIARAAGAQSNwF-L9Ir__AzsWQOzaDHpFx0QSmfWGZeoc-35l3NNC_bP5jtO1kKr1BNZle94sW0ko1m8GVBVEg';


const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(chatID, recipient) {
    try {
        let chat;
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'patildhanshrees6112@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'Dhanshree Patil <patildhanshrees6112@gmail.com>',
            to:  recipient,
            subject: 'Chat conversation',
            text: 'Your chats',
            html: ``,
        };

        const messages = await Message.find({ chat: chatID }).populate(
            "sender",
            "name pic email"
         ).populate("chat");


        mailOptions.html= (jsonToChatHTML(getMessages(messages)));
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.log(error)
    }
}
function getMessages(jsonData) {
    const messages = [];
  
    for (let i = 0; i < jsonData.length; i++) {
      const message = {};
      const data = jsonData[i];
  
      message.message = data.content;
      message.senderName = data.sender.name;
      message.createdAt = new Date(data.createdAt);
  
      messages.push(message);
    }
  
    return messages;
}
  
function jsonToChatHTML(jsonData) {
  const dom = new JSDOM(`<!DOCTYPE html>`);
  const document = dom.window.document;

  const chatContainer = document.createElement("table");
  chatContainer.classList.add("chat-container");
  chatContainer.style.borderCollapse = "collapse";

  let lastSender = null;

  for (let i = 0; i < jsonData.length; i++) {
    const message = jsonData[i].message;
    const senderName = jsonData[i].senderName;
    const createdAt = new Date(jsonData[i].createdAt).toLocaleTimeString();

    const chatMessage = document.createElement("tr");
    chatMessage.style.borderBottom = "1px solid #ccc";

    const messageText = document.createElement("td");
    messageText.textContent = message;
    messageText.style.padding = "10px";

    const messageInfo = document.createElement("td");
    messageInfo.style.textAlign = "right";
    messageInfo.style.fontSize = "10px";
    messageInfo.style.color = "#666";
    messageInfo.style.padding = "10px";

    const senderNameText = document.createElement("span");
    senderNameText.textContent = senderName;

    const createdAtText = document.createElement("span");
    createdAtText.textContent = createdAt;

    if (lastSender !== senderName) {
      const senderRow = document.createElement("tr");
      const senderCell = document.createElement("td");
      senderCell.textContent = senderName;
      senderCell.style.backgroundColor = "#eee";
      senderCell.style.fontWeight = "bold";
      senderCell.style.padding = "10px";
      senderCell.setAttribute("colspan", "2");
      senderRow.appendChild(senderCell);
      chatContainer.appendChild(senderRow);
    }

    lastSender = senderName;

    messageInfo.appendChild(senderNameText);
    messageInfo.appendChild(document.createElement("br"));
    messageInfo.appendChild(createdAtText);

    chatMessage.appendChild(messageText);
    chatMessage.appendChild(messageInfo);

    chatContainer.appendChild(chatMessage);
  }

  return chatContainer.outerHTML;
}


module.exports = {sendMail};
//