const messagesRouter = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

messagesRouter.post("/", async (request, response) => {
  const {body} = request;
  const sender = await User.findById(body.sender);
  const receiver = await User.findById(body.receiver);
  if (!sender) {
    response
      .status(400)
      .json({error: "The sender for this message is invalid"});
  }
  if (!receiver) {
    response
      .status(400)
      .json({error: "The reciever for this message is invalid"});
  }
  const newMessage = new Message({...body, creationDate: Date.Now});
  const saveMessage = await newMessage.save();
  sender.messages = sender.messages.concat(saveMessage._id);
  await sender.save();
  receiver.messages = receiver.messages.concat(saveMessage._id);
  await receiver.save();
  response.json(saveMessage);
});

messagesRouter.get("/", async (request, response) => {
  const {token} = request;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({error: "token missing or invalid"});
  }
  const user = await User.findById(decodedToken.id).populate("messages");
  response.json(user.messages);
});
messagesRouter.get("/:id", async (request, response) => {
  const {id} = request.params;
  const readMessage = await Message.findById(id);
  readMessage.read = true;
  await readMessage.save();
  response.json(readMessage);
});

module.exports = messagesRouter;
