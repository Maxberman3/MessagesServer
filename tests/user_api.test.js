const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../utils/test_helper");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User");
const Message = require("../models/Message");

beforeEach(async () => {
  await helper.initializeTests();
});

test("users get request returns all users", async () => {
  const response = await api.get("/api/users").expect(200);
  const users = await User.find({});
  expect(response.body).toHaveLength(users.length);
});

test("requesting a specific user's messages returns their messages", async () => {
  const response = await api
    .get(`/api/users/${helper.initialUsers[0]._id}/messages`)
    .expect(200);
  expect(response.body).toHaveLength(helper.initialUsers[0].messages.length);
});

test("requesting unread messages for a specific user", async () => {
  const charlieId = helper.initialUsers[1]._id;
  const response = await api
    .get(`/api/users/${helper.initialUsers[1]._id}/messages/true`)
    .expect(200);
  const initialUnread = helper.initialMessages.filter(
    message =>
      (message.sender === charlieId || message.receiver === charlieId) &&
      !message.read
  );
  expect(response.body).toHaveLength(initialUnread.length);
});

test("the sender or receiver can delete a message", async () => {
  const frank = helper.initialUsers[0];
  const charlie = helper.initialUsers[1];
  await api
    .delete(`/api/users/${frank._id}/messages/${frank.messages[0]}`)
    .expect(204);
  const messages = await Message.find({});
  expect(messages.length).toEqual(helper.initialMessages.length - 1);
  const frankAfter = await User.findById(frank._id);
  expect(frankAfter.messages.length).not.toContain(frank.messages[0]);
  const charlieAfter = await User.findById(charlie._id);
  expect(charlieAfter.messages.length).not.toContain(frank.messages[0]);
});

test("if not the sender or receiver, unable to delete a message", async () => {
  const frank = helper.initialUsers[0];
  const response = await api
    .delete(`/api/users/${frank._id}/messages/${helper.initialMessages[2]._id}`)
    .expect(403);
  expect(response.body.error).toBeDefined();
  expect(response.body.error).toContain("Only the sender or receiver");
});

afterAll(() => {
  mongoose.connection.close();
});
