const messagesRouter = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

messagesRouter.post("/", async (request, response) => {
  const {body} = request;
  const sender = await User.findById(body.sender);
  const receiver = await User.findById(body.reciever);
  if (!sender) {
    response
      .status(400)
      .json({error: "The sender for this message is invalid"});
  }
  if (!reciever) {
    response
      .status(400)
      .json({error: "The reciever for this message is invalid"});
  }
  const newMessage = new Message({...body});
  const saveMessage = await newMessage.save();
  sender.messages = sender.messages.concat(saveMessage._id);
  await sender.save();
  reciever.messages = reciever.messages.concat(saveMessage._id);
  await reciever.save();
  response.json(saveMessage);
});

module.exports = messagesRouter;
