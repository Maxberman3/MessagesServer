const config = require("./utils/config");
const http = require("http");
const express = require("express");
require("express-async-errors");
const app = express();
const usersRouter = require("./controllers/users");
const messagesRouter = require("./controllers/messages");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

mongoose
  .connect(config.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.info("connected to MongoDB");
  })
  .catch(error => {
    console.error("error connection to MongoDB:", error.message);
  });

app.use(express.json());
app.use(middleware.morganLogger());
app.use(middleware.tokenExtractor);

app.use("/api/users", usersRouter);
app.use("/api/messagesRouter", messagesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
