const usersRouter = require("express").Router();
const User = require("../models/User");
const Message = require("../models/Message");
const bcrypt = require("bcrypt");

usersRouter.post("/", async (request, response) => {
  const body = request.body;
  if (!body.password || !(body.password.length > 3)) {
    response.status(400).json({error: "The password was not long enough"});
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  });
  const savedUser = await user.save();
  response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.get("/messages/:id/:onlyUnread", async (request, response) => {
  if (!request.params.id || !request.params.onlyUnread) {
    response
      .status(400)
      .json({error: "You are missing a parameter in your request"});
  }
  const user = await User.findById(request.params.id);
  if (!user) {
    response.status(400).json({error: "There is no user with that id"});
  }
  const userMessages = await user.populate("messages").messages;
  let messages =
    request.params.onlyUnread.toLowerCase() === "true"
      ? userMessages.filter(message => !message.read)
      : userMessages;
  response.json(messages);
});
module.exports = usersRouter;
