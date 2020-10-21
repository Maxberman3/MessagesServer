const usersRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Message = require("../models/Message");

//route to create a new user, expects a username and password in the body of the request
usersRouter.post("/", async (request, response) => {
  const {username, password} = request.body;
  if (!password || !(password.length > 3)) {
    response.status(400).json({error: "The password was not long enough"});
  }
  //use bcrypt library to hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username: username,
    passwordHash,
    messages: []
  });
  const savedUser = await user.save();
  response.json(savedUser);
});

//route to get all users
usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

//route to get user info by username
usersRouter.get("/:username", async (request, response) => {
  const {username} = request.params;
  const user = await User.findOne({username: username});
  if (!user) {
    return response.status(404).error("There is no user with that username");
  }
  response.json(user);
});

//route to get all of a particular user's messages, with an optional parmeter to specify if it should
// only be unread messages
usersRouter.get("/:id/messages/:onlyUnread?", async (request, response) => {
  let {onlyUnread, id} = request.params;
  if (!id) {
    response
      .status(400)
      .json({error: "You are missing an id parameter in your request"});
  }
  if (!onlyUnread) {
    onlyUnread = "false";
  }
  //retrieve from db
  const user = await User.findById(request.params.id).populate("messages", {
    sender: 1,
    reciever: 1,
    message: 1,
    subject: 1,
    creationDate: 1,
    read: 1
  });
  if (!user) {
    response.status(400).json({error: "There is no user with that id"});
  }
  //filter for only read messages
  let messages =
    onlyUnread.toLowerCase() === "true"
      ? user.messages.filter(message => !message.read)
      : user.messages;
  response.json(messages);
});

//route to delete a user's message
usersRouter.delete("/:id/messages/:messageid", async (request, response) => {
  const {id, messageid} = request.params;
  if (!id || !messageid) {
    return response
      .status(400)
      .json({error: "You are missing a parameter in your request"});
  }
  const deleteMessage = await Message.findById(messageid);
  if (!deleteMessage) {
    return response.status(400).json({error: "The is no message with that id"});
  }
  //check that it's the sender or the reciever that is deleting the message
  if (
    deleteMessage.sender.toString() !== id &&
    deleteMessage.receiver.toString() !== id
  ) {
    return response.status(403).json({
      error: "Only the sender or receiver of a messages can delete that message"
    });
  }
  //delete the message from the sender and reciever's messages
  let sender = await User.findById(deleteMessage.sender);
  let receiver = await User.findById(deleteMessage.receiver);
  sender.messages = sender.messages.filter(message => message._id !== id);
  await sender.save();
  receiver.messages = receiver.messages.filter(message => message._id !== id);
  await receiver.save();
  await deleteMessage.remove();
  response.status(204).end();
});
module.exports = usersRouter;
