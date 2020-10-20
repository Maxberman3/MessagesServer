const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../utils/test_helper");
const app = require("../app");
const api = supertest(app);
const Message = require("../models/Message");
const User = require("../models/User");

beforeEach(async () => {
  await Message.deleteMany({});
  await User.deleteMany({});
  helper.initialUsers[0].passwordHash = await helper.getHash("rumHam");
  helper.initialUsers[1].passwordHash = await helper.getHash("charlieWork");
  console.log(helper.initialUsers);
  await Promise.all(
    helper.initialUsers.map(async user => {
      let saveUser = new User({...user});
      await saveUser.save();
    })
  );
  await Promise.all(
    helper.initialMessages.map(async message => {
      let saveMessage = new Message({...message});
      await saveMessage.save();
    })
  );
});
test("users get request returns all users", async () => {
  const response = await api.get("/api/users");
  console.log(response.body);
});

afterAll(() => {
  mongoose.connection.close();
});
