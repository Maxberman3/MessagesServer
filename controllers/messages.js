const messagesRouter = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//Message router for sending messages, accepts a post request
// body of request gives the id's for sender & receiver as well as
// the subject and message
messagesRouter.post("/", async (request, response) => {
  const {body} = request;
  //find the sender and receiver
  const sender = await User.findById(body.sender);
  const receiver = await User.findById(body.receiver);
  //check validity
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
  //save message to db & to each user's messages
  const newMessage = new Message({...body, creationDate: Date.Now});
  const saveMessage = await newMessage.save();
  sender.messages = sender.messages.concat(saveMessage._id);
  await sender.save();
  receiver.messages = receiver.messages.concat(saveMessage._id);
  await receiver.save();
  response.json(saveMessage);
});
//route to get a user's messages. checks the authentication token for the
// user's id, and retrieves their messages
messagesRouter.get("/", async (request, response) => {
  const {token} = request;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({error: "token missing or invalid"});
  }
  const user = await User.findById(decodedToken.id).populate("messages");
  if (!user) {
    return response
      .status(400)
      .json({error: "The token does not identify a valid user"});
  }
  response.json(user.messages);
});
//route to get a specific message, or "read" it.
messagesRouter.get("/:id", async (request, response) => {
  const {id} = request.params;
  //retrieve message from db
  const readMessage = await Message.findById(id);
  //set the message to read
  readMessage.read = true;
  await readMessage.save();
  response.json(readMessage);
});

module.exports = messagesRouter;
