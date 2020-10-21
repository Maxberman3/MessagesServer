const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

//Router for logging in a user, expects the request body
// to contain a username & password
loginRouter.post("/", async (request, response) => {
  const {username, password} = request.body;
  //find the associated user
  const user = await User.findOne({username: username});

  //check password
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password"
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id
  };
  //generate a json web token for authentication
  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(200).send({token, username: user.username});
});

module.exports = loginRouter;
