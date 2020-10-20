const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userId1 = mongoose.Types.ObjectId();
const userId2 = mongoose.Types.ObjectId();
const messageId1 = mongoose.Types.ObjectId();
const messageId2 = mongoose.Types.ObjectId();

const getHash = async password => {
  passwordHash = await bcrypt.hash("sekret", 10);
  return passwordHash;
};

const initialMessages = [
  {
    sender: userId1,
    receiver: userId2,
    message: "When I'm dead, throw me in the trash",
    subject: "Guess What?!",
    creationDate: Date.Now,
    read: false,
    deletedBy: null,
    _id: messageId1
  },
  {
    sender: userId2,
    receiver: userId1,
    message:
      "Just get a job? Why don't I strap on my job helmet and squeeze down into a job cannon and fire off into job land, where jobs grow on jobbies",
    subject: "Post Office Employment",
    creationDate: Date.Now,
    read: false,
    deletedBy: null,
    _id: messageId2
  }
];
const initialUsers = [
  {
    username: "Frank Reynolds",
    passwordHash: null,
    _id: userId1,
    messages: [messageId1, messageId2]
  },
  {
    username: "Charlie Day",
    passwordHash: null,
    _id: userId2,
    messages: [messageId1, messageId2]
  }
];
// console.log(initialUsers);
module.exports = {
  initialUsers,
  initialMessages,
  getHash
};
