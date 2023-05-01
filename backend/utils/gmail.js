const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Message = require('../models/messageModel');

const CLIENT_ID = '39971611594-6jqeqohge5s03h0bglko5mj00g1d1bpq.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04ZvDFrAwn3P8CgYIARAAGAQSNwF-L9Ir9xKo-57RER4nd3iKqw3jiT_MIkemzBTX3DPSpK1EhuYjwBNotKJT35H7L14yBbKYWc4';


const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(chatID) {
    try {
        let chat;
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'jitendrasatyarathi@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'Jitendra Satyarathi <jitendrasatyarathi@gmail.com>',
            to: "gmail@gmail.com",
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
  
    const chatContainer = document.createElement("div");
    chatContainer.classList.add("chat-container");
  
    for (let i = 0; i < jsonData.length; i++) {
      const message = jsonData[i].message;
      const senderName = jsonData[i].senderName;
      const createdAt = new Date(jsonData[i].createdAt).toLocaleTimeString();
  
      const chatMessage = document.createElement("div");
      chatMessage.classList.add("chat-message");
      if (senderName === "Jitendra") {
        chatMessage.classList.add("chat-message-right");
      } else {
        chatMessage.classList.add("chat-message-left");
      }
  
      const messageText = document.createElement("p");
      messageText.textContent = message;
  
      const messageInfo = document.createElement("div");
      messageInfo.classList.add("message-info");
  
      const senderNameText = document.createElement("span");
      senderNameText.textContent = senderName;
  
      const createdAtText = document.createElement("span");
      createdAtText.textContent = createdAt;
  
      messageInfo.appendChild(senderNameText);
      messageInfo.appendChild(createdAtText);
  
      chatMessage.appendChild(messageText);
      chatMessage.appendChild(messageInfo);
  
      chatContainer.appendChild(chatMessage);
    }
  
    return chatContainer.outerHTML;
  }

module.exports = {sendMail};
//