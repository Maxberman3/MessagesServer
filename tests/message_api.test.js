const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../utils/test_helper");
const app = require("../app");
const api = supertest(app);
const Message = require("../models/Message");

beforeEach(async () => {
  await helper.initializeTests();
});

test("sending a new message", async () => {
  const newMessage = {
    sender: helper.initialUsers[0]._id,
    receiver: helper.initialUsers[1]._id,
    message:
      "I don't know how many years I have left on this earth, I'm gonna get real weird with it",
    subject: "Charlie's birthday party"
  };
  const response = await api
    .post("/api/messages")
    .send(newMessage)
    .expect(200);
  expect(response.body.message).toBeDefined();
  expect(response.body.message).toContain("get real weird");
  const afterPost = await Message.find({});
  expect(afterPost.length).toEqual(helper.initialMessages.length + 1);
});

test("reading a message", async () => {
  const response = await api
    .get(`/api/messages/${helper.initialMessages[0]._id}`)
    .expect(200);
  expect(response.body.message).toContain("throw me in the trash");
  const afterPost = Message.findById(helper.initialMessages[0]._id);
  expect(afterPost.read).toBeTruthy();
});

test.only("a logged in user can get their all of their messages", async () => {
  const frank = helper.initialUsers[0];
  const loginResponse = await api
    .post("/api/login")
    .send({username: frank.username, password: "rumHam"})
    .expect(200);
  const {token} = loginResponse.body;
  const response = await api
    .get("/api/messages")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  expect(response.body.length).toEqual(frank.messages.length);
  expect(response.body[0].id).toEqual(frank.messages[0].toString());
  expect(response.body[1].id).toEqual(frank.messages[1].toString());
});
afterAll(() => {
  mongoose.connection.close();
});
