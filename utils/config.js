require("dotenv").config();

const PORT = process.env.PORT || 4000;

let MONGO_DB_URI = process.env.MONGO_DB_URI;

if (process.env.NODE_ENV === "test") {
  MONGO_DB_URI = process.env.TEST_MONGO_DB_URI;
}

module.exports = {
  MONGO_DB_URI,
  PORT
};
