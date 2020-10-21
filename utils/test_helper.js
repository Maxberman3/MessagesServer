const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Message = require("../models/Message");
const User = require("../models/User");

const userId1 = mongoose.Types.ObjectId();
const userId2 = mongoose.Types.ObjectId();
const userId3 = mongoose.Types.ObjectId();
const messageId1 = mongoose.Types.ObjectId();
const messageId2 = mongoose.Types.ObjectId();
const messageId3 = mongoose.Types.ObjectId();

const getHash = async password => {
  const passwordHash = await bcrypt.hash(password, 10);
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
    _id: messageId2
  },
  {
    sender: userId3,
    receiver: userId2,
    message:
      "If you don't have care insurance you better have dental, because I'm about to smash your teeth to dust",
    subject: "Charlie!",
    creationDate: Date.Now,
    read: true,
    _id: messageId3
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
    messages: [messageId1, messageId2, messageId3]
  },
  {
    username: "Sweet Dee",
    passwordHash: null,
    _id: userId3,
    messages: [messageId3]
  }
];
const initializeTests = async () => {
  await Message.deleteMany({});
  await User.deleteMany({});
  initialUsers[0].passwordHash = await getHash("rumHam");
  initialUsers[1].passwordHash = await getHash("charlieWork");
  initialUsers[2].passwordHash = await getHash("totallyNotABird");
  await Promise.all(
    initialUsers.map(async user => {
      let saveUser = new User({...user});
      await saveUser.save();
    })
  );
  await Promise.all(
    initialMessages.map(async message => {
      let saveMessage = new Message({...message});
      await saveMessage.save();
    })
  );
};
module.exports = {
  initialUsers,
  initialMessages,
  initializeTests
};
