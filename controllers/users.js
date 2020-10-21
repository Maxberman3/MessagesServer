const usersRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Message = require("../models/Message");

usersRouter.post("/", async (request, response) => {
  const body = request.body;
  if (!body.password || !(body.password.length > 3)) {
    response.status(400).json({error: "The password was not long enough"});
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    passwordHash,
    messages: []
  });
  const savedUser = await user.save();
  response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

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
  let messages =
    onlyUnread.toLowerCase() === "true"
      ? user.messages.filter(message => !message.read)
      : user.messages;
  response.json(messages);
});

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
  if (
    deleteMessage.sender.toString() !== id &&
    deleteMessage.receiver.toString() !== id
  ) {
    return response.status(403).json({
      error: "Only the sender or receiver of a messages can delete that message"
    });
  }
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
